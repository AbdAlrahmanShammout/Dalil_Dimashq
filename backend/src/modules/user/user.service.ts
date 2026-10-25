import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { ApiAudience } from '@/common/auth/principal.interface';
import { TransactionRunner } from '@/common/base/transaction-runner';
import { AccessDeniedException } from '@/common/exceptions/access-denied.exception';
import { ConflictException } from '@/common/exceptions/conflict.exception';
import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { UnauthenticatedException } from '@/common/exceptions/unauthenticated.exception';
import {
  AuthenticateServiceInput,
  ChangePasswordServiceInput,
  CreateRefreshTokenRepoInput,
  GoogleSignInServiceInput,
  PasswordResetCodeResult,
  ResetPasswordServiceInput,
  RotateRefreshTokenServiceInput,
  SignUpResult,
  SignUpServiceInput,
  VerifyEmailServiceInput,
} from '@/modules/user/defs/user.defs';
import { UserEntity } from '@/modules/user/entity/user.entity';
import {
  AuthDoor,
  BCRYPT_ROUNDS,
  EMAIL_CODE_TTL_MS,
  EmailCodePurpose,
  ProfileLanguage,
} from '@/modules/user/enum/general.enum';
import {
  isBirthYearInRange,
  isOldEnough,
  isPersonName,
  normalizeSyrianPhone,
} from '@/modules/user/profile-rules';
import { UserRepository } from '@/modules/user/repository/user.repository';
import {
  createNumericCode,
  doesHashMatch,
  hashSecret,
  isPasswordAcceptable,
} from '@/modules/user/secret';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly transactionRunner: TransactionRunner,
  ) {}

  /**
   * Opens the visitor or owner door on a new email, or on the other door when the password matches.
   */
  async signUp(input: SignUpServiceInput): Promise<SignUpResult> {
    this.assertPassword(input.password);
    const email = normalizeEmail(input.email);
    const existing = await this.userRepository.findByEmail(email);
    if (!existing) {
      return this.createDoorAccount(input, email);
    }
    return this.openExistingDoor(existing, input, email);
  }

  /**
   * Confirms an email code. A wrong code and an expired code return the same error.
   */
  async verifyEmail(input: VerifyEmailServiceInput): Promise<void> {
    const user = await this.userRepository.findByEmail(normalizeEmail(input.email));
    const record = user
      ? await this.userRepository.findLatestEmailCode({
          userId: user.id,
          audience: input.audience,
          purpose: input.purpose,
        })
      : null;
    const matches = this.isCodeActive(record, input.code);
    if (!user || !record || !matches) {
      throw new InvalidStateException({ message: 'Invalid code', code: 'invalid_code' });
    }
    await this.transactionRunner.run(async (context) => {
      await this.userRepository.consumeEmailCode(record.id, context);
      if (input.purpose === EmailCodePurpose.Signup) {
        await this.userRepository.updateDoor({ id: user.id, emailVerifiedAt: new Date() }, context);
      }
    });
  }

  /**
   * Checks the shared password and that this door is open. Staff and the other door are rejected.
   */
  async authenticate(input: AuthenticateServiceInput): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(normalizeEmail(input.email));
    const doorOpen = user ? this.hasDoor(user, input.door) : false;
    if (!user || user.staffRole || !doorOpen) {
      throw new UnauthenticatedException({
        message: 'Invalid credentials',
        code: 'invalid_credentials',
      });
    }
    if (!user.passwordHash) {
      throw new InvalidStateException({ message: 'Password not set', code: 'password_not_set' });
    }
    const matches = await bcrypt.compare(input.password, user.passwordHash);
    if (!matches) {
      throw new UnauthenticatedException({
        message: 'Invalid credentials',
        code: 'invalid_credentials',
      });
    }
    if (!user.emailVerifiedAt) {
      throw new UnauthenticatedException({
        message: 'Email not confirmed',
        code: 'email_not_confirmed',
      });
    }
    return user;
  }

  /**
   * Creates a reset code only when that door is open. Staff passwords are not reset here.
   */
  async createPasswordResetCode(input: {
    readonly email: string;
    readonly audience: ApiAudience;
    readonly door: AuthDoor;
  }): Promise<PasswordResetCodeResult | null> {
    const user = await this.userRepository.findByEmail(normalizeEmail(input.email));
    if (!user || user.staffRole || !this.hasDoor(user, input.door)) {
      return null;
    }
    const code = await this.storeEmailCode(user.id, input.audience, EmailCodePurpose.PasswordReset);
    return { email: user.email, code };
  }

  /**
   * Sets the one shared password and revokes every audience's refresh tokens.
   */
  async resetPassword(input: ResetPasswordServiceInput): Promise<void> {
    this.assertPassword(input.password);
    const user = await this.userRepository.findByEmail(normalizeEmail(input.email));
    if (!user || user.staffRole || !this.hasDoor(user, input.door)) {
      throw new InvalidStateException({ message: 'Invalid code', code: 'invalid_code' });
    }
    await this.verifyEmail({
      email: user.email,
      code: input.code,
      audience: input.audience,
      purpose: EmailCodePurpose.PasswordReset,
    });
    await this.replacePassword(user.id, input.password);
  }

  /**
   * Changes the shared password after the current one matches, then revokes every refresh token.
   */
  async changePassword(input: ChangePasswordServiceInput): Promise<void> {
    this.assertPassword(input.newPassword);
    const user = await this.requireUser(input.userId);
    if (!user.passwordHash) {
      throw new InvalidStateException({ message: 'Password not set', code: 'password_not_set' });
    }
    const matches = await bcrypt.compare(input.currentPassword, user.passwordHash);
    if (!matches) {
      throw new UnauthenticatedException({
        message: 'Password mismatch',
        code: 'password_mismatch',
      });
    }
    await this.replacePassword(user.id, input.newPassword);
  }

  /**
   * Opens only the visitor door for a Google account. An existing owner flag is left as it is.
   */
  async signInWithGoogleEmail(input: GoogleSignInServiceInput): Promise<UserEntity> {
    const email = normalizeEmail(input.email);
    const existing = await this.userRepository.findByEmail(email);
    if (existing?.staffRole) {
      throw new AccessDeniedException({ message: 'Staff email', code: 'staff_email' });
    }
    if (!existing) {
      return this.userRepository.create({
        email,
        passwordHash: null,
        isVisitor: true,
        isOwner: false,
        emailVerifiedAt: new Date(),
      });
    }
    return this.userRepository.updateDoor({
      id: existing.id,
      isVisitor: true,
      emailVerifiedAt: existing.emailVerifiedAt ?? new Date(),
    });
  }

  /**
   * Accepts only a staff row. There is no public staff sign-up.
   */
  async authenticateStaff(input: {
    readonly email: string;
    readonly password: string;
  }): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(normalizeEmail(input.email));
    if (!user?.staffRole || !user.passwordHash) {
      throw new UnauthenticatedException({
        message: 'Invalid credentials',
        code: 'invalid_credentials',
      });
    }
    const matches = await bcrypt.compare(input.password, user.passwordHash);
    if (!matches) {
      throw new UnauthenticatedException({
        message: 'Invalid credentials',
        code: 'invalid_credentials',
      });
    }
    return user;
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }

  /**
   * Fills the empty visitor profile once. A taken phone or an under-16 birth year is refused.
   */
  async completeProfile(input: {
    readonly userId: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly phone: string;
    readonly birthYear: number;
    readonly language: ProfileLanguage;
    readonly now?: Date;
  }): Promise<UserEntity> {
    const now = input.now ?? new Date();
    const user = await this.requireUser(input.userId);
    if (user.profile?.firstName) {
      throw new ConflictException({
        message: 'Profile is already complete',
        code: 'profile_already_complete',
      });
    }
    const firstName = input.firstName.trim();
    const lastName = input.lastName.trim();
    if (!isPersonName(firstName) || !isPersonName(lastName)) {
      throw new InvalidStateException({ message: 'Name is invalid', code: 'name_invalid' });
    }
    const phone = normalizeSyrianPhone(input.phone);
    if (!phone) {
      throw new InvalidStateException({ message: 'Phone is invalid', code: 'phone_invalid' });
    }
    if (!isBirthYearInRange(input.birthYear, now)) {
      throw new InvalidStateException({
        message: 'Birth year is invalid',
        code: 'birth_year_invalid',
      });
    }
    if (!isOldEnough(input.birthYear, now)) {
      throw new InvalidStateException({ message: 'Too young', code: 'too_young' });
    }
    const taken = await this.userRepository.findByPhone(phone);
    if (taken && taken.id !== user.id) {
      throw new ConflictException({ message: 'Phone is taken', code: 'phone_taken' });
    }
    return this.userRepository.completeProfile({
      userId: user.id,
      firstName,
      lastName,
      phone,
      birthYear: input.birthYear,
      language: input.language,
    });
  }

  /**
   * Changes phone and language on a completed profile. A new phone is unverified.
   */
  async updateProfileContact(input: {
    readonly userId: string;
    readonly phone?: string;
    readonly language?: ProfileLanguage;
  }): Promise<UserEntity> {
    if (input.phone === undefined && input.language === undefined) {
      throw new InvalidStateException({ message: 'Nothing to change', code: 'nothing_to_change' });
    }
    const user = await this.requireUser(input.userId);
    if (!user.profile?.firstName) {
      throw new InvalidStateException({
        message: 'Profile is incomplete',
        code: 'profile_incomplete',
      });
    }
    let phone = user.profile.phone ?? undefined;
    let clearPhoneVerified = false;
    if (input.phone !== undefined) {
      const normalized = normalizeSyrianPhone(input.phone);
      if (!normalized) {
        throw new InvalidStateException({ message: 'Phone is invalid', code: 'phone_invalid' });
      }
      const taken = await this.userRepository.findByPhone(normalized);
      if (taken && taken.id !== user.id) {
        throw new ConflictException({ message: 'Phone is taken', code: 'phone_taken' });
      }
      clearPhoneVerified = normalized !== user.profile.phone;
      phone = normalized;
    }
    return this.userRepository.updateProfileContact({
      userId: user.id,
      phone,
      clearPhoneVerified,
      language: input.language,
    });
  }

  /**
   * Closes one door. The row is removed only when both doors are closed and the user is not staff.
   * Place links and bookings stay detached from the user when those tables exist.
   */
  async deleteDoor(input: {
    readonly userId: string;
    readonly door: AuthDoor;
    readonly password: string;
    readonly audience: ApiAudience;
  }): Promise<{ readonly removed: boolean }> {
    const user = await this.requireUser(input.userId);
    if (!this.hasDoor(user, input.door)) {
      throw new AccessDeniedException({ message: 'Door is closed', code: 'not_allowed' });
    }
    if (!user.passwordHash) {
      throw new InvalidStateException({ message: 'Password not set', code: 'password_not_set' });
    }
    const matches = await bcrypt.compare(input.password, user.passwordHash);
    if (!matches) {
      throw new UnauthenticatedException({
        message: 'Password mismatch',
        code: 'password_mismatch',
      });
    }
    const isVisitor = input.door === AuthDoor.Visitor ? false : user.isVisitor;
    const isOwner = input.door === AuthDoor.Owner ? false : user.isOwner;
    const removed = !isVisitor && !isOwner && user.staffRole === null;
    await this.transactionRunner.run(async (context) => {
      await this.userRepository.updateDoor({ id: user.id, isVisitor, isOwner }, context);
      await this.userRepository.revokeAudienceRefreshTokens(
        { userId: user.id, audience: input.audience },
        context,
      );
      if (removed) {
        await this.userRepository.deleteById(user.id, context);
      }
    });
    return { removed };
  }

  async saveRefreshToken(input: CreateRefreshTokenRepoInput): Promise<void> {
    await this.userRepository.createRefreshToken(input);
  }

  /**
   * Revokes the presented refresh token and stores the next one. The shared token version is unchanged.
   */
  async rotateRefreshToken(input: RotateRefreshTokenServiceInput): Promise<UserEntity> {
    const record = await this.userRepository.findRefreshToken(hashSecret(input.refreshToken));
    const usable =
      record &&
      !record.revokedAt &&
      record.expiresAt.getTime() > Date.now() &&
      record.audience === input.audience;
    if (!record || !usable) {
      throw new UnauthenticatedException();
    }
    const user = await this.requireUser(record.userId);
    this.assertAudienceStillOpen(user, input.audience);
    await this.transactionRunner.run(async (context) => {
      await this.userRepository.revokeRefreshToken(record.id, context);
      await this.userRepository.createRefreshToken(
        {
          userId: user.id,
          audience: input.audience,
          tokenHash: input.nextTokenHash,
          expiresAt: input.nextExpiresAt,
        },
        context,
      );
    });
    return user;
  }

  /**
   * Revokes refresh tokens for one audience and does not bump the shared token version.
   */
  async revokeAudienceRefreshTokens(input: {
    readonly userId: string;
    readonly audience: ApiAudience;
  }): Promise<void> {
    await this.userRepository.revokeAudienceRefreshTokens(input);
  }

  private async createDoorAccount(input: SignUpServiceInput, email: string): Promise<SignUpResult> {
    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const user = await this.userRepository.create({
      email,
      passwordHash,
      isVisitor: input.door === AuthDoor.Visitor,
      isOwner: input.door === AuthDoor.Owner,
    });
    const code = await this.storeEmailCode(user.id, input.audience, EmailCodePurpose.Signup);
    return { status: 'code_sent', email, code };
  }

  private async openExistingDoor(
    existing: UserEntity,
    input: SignUpServiceInput,
    email: string,
  ): Promise<SignUpResult> {
    if (existing.staffRole) {
      throw new AccessDeniedException({ message: 'Staff email', code: 'staff_email' });
    }
    if (this.hasDoor(existing, input.door)) {
      throw new ConflictException({ message: 'Email taken', code: 'email_taken' });
    }
    if (!existing.passwordHash) {
      throw new InvalidStateException({ message: 'Password not set', code: 'password_not_set' });
    }
    const matches = await bcrypt.compare(input.password, existing.passwordHash);
    if (!matches) {
      throw new UnauthenticatedException({
        message: 'Invalid credentials',
        code: 'invalid_credentials',
      });
    }
    await this.userRepository.updateDoor({
      id: existing.id,
      isVisitor: input.door === AuthDoor.Visitor ? true : undefined,
      isOwner: input.door === AuthDoor.Owner ? true : undefined,
    });
    if (existing.emailVerifiedAt) {
      return { status: 'ready', email };
    }
    const code = await this.storeEmailCode(existing.id, input.audience, EmailCodePurpose.Signup);
    return { status: 'code_sent', email, code };
  }

  private async replacePassword(userId: string, password: string): Promise<void> {
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    await this.transactionRunner.run(async (context) => {
      await this.userRepository.updatePassword({ id: userId, passwordHash }, context);
      await this.userRepository.revokeAllRefreshTokens(userId, context);
    });
  }

  private async storeEmailCode(
    userId: string,
    audience: ApiAudience,
    purpose: EmailCodePurpose,
  ): Promise<string> {
    const code = createNumericCode();
    await this.userRepository.createEmailCode({
      userId,
      audience,
      purpose,
      codeHash: hashSecret(code),
      expiresAt: new Date(Date.now() + EMAIL_CODE_TTL_MS),
    });
    return code;
  }

  private isCodeActive(
    record: { codeHash: string; expiresAt: Date; consumedAt: Date | null } | null,
    code: string,
  ): boolean {
    if (!record || record.consumedAt || record.expiresAt.getTime() <= Date.now()) {
      return false;
    }
    return doesHashMatch(record.codeHash, hashSecret(code));
  }

  private hasDoor(user: UserEntity, door: AuthDoor): boolean {
    return door === AuthDoor.Visitor ? user.isVisitor : user.isOwner;
  }

  private assertAudienceStillOpen(user: UserEntity, audience: ApiAudience): void {
    const isOpen =
      (audience === ApiAudience.ClientApp && user.isVisitor) ||
      (audience === ApiAudience.DashboardOwner && user.isOwner) ||
      (audience === ApiAudience.AdminPanel && user.staffRole !== null);
    if (!isOpen) {
      throw new UnauthenticatedException();
    }
  }

  private assertPassword(password: string): void {
    if (!isPasswordAcceptable(password)) {
      throw new InvalidStateException({ message: 'Password invalid', code: 'password_invalid' });
    }
  }

  private async requireUser(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UnauthenticatedException();
    }
    return user;
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
