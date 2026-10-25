import { TransactionContext, TransactionRunner } from '@/common/base/transaction-runner';
import { ApiAudience } from '@/common/auth/principal.interface';
import {
  CreateEmailCodeRepoInput,
  CreateRefreshTokenRepoInput,
  CreateUserRepoInput,
  EmailCodeRecord,
  FindEmailCodeRepoInput,
  RefreshTokenRecord,
  RevokeAudienceTokensRepoInput,
  UpdateDoorRepoInput,
  UpdatePasswordRepoInput,
} from '@/modules/user/defs/user.defs';
import { UserEntity } from '@/modules/user/entity/user.entity';
import { ProfileEntity } from '@/modules/user/entity/profile.entity';
import {
  AuthDoor,
  EmailCodePurpose,
  ProfileLanguage,
  StaffRole,
} from '@/modules/user/enum/general.enum';
import {
  CompleteProfileRepoInput,
  UpdateProfileContactRepoInput,
  UserRepository,
} from '@/modules/user/repository/user.repository';
import { hashSecret } from '@/modules/user/secret';
import { UserService } from '@/modules/user/user.service';

interface StoredCode {
  id: string;
  userId: string;
  audience: ApiAudience;
  purpose: EmailCodePurpose;
  codeHash: string;
  expiresAt: Date;
  consumedAt: Date | null;
}

interface StoredToken {
  id: string;
  userId: string;
  audience: ApiAudience;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
}

class MemoryUserRepository extends UserRepository {
  readonly users: UserEntity[] = [];
  readonly codes: StoredCode[] = [];
  readonly tokens: StoredToken[] = [];

  async findById(id: string): Promise<UserEntity | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async create(input: CreateUserRepoInput): Promise<UserEntity> {
    const user = buildUser({
      id: `user-${this.users.length + 1}`,
      email: input.email,
      passwordHash: input.passwordHash,
      isVisitor: input.isVisitor,
      isOwner: input.isOwner,
      emailVerifiedAt: input.emailVerifiedAt ?? null,
      staffRole: input.staffRole ?? null,
    });
    this.users.push(user);
    return user;
  }

  async updateDoor(input: UpdateDoorRepoInput): Promise<UserEntity> {
    const user = await this.require(input.id);
    if (input.isVisitor !== undefined) {
      user.isVisitor = input.isVisitor;
    }
    if (input.isOwner !== undefined) {
      user.isOwner = input.isOwner;
    }
    if (input.emailVerifiedAt !== undefined) {
      user.emailVerifiedAt = input.emailVerifiedAt;
    }
    return user;
  }

  async updatePassword(input: UpdatePasswordRepoInput): Promise<UserEntity> {
    const user = await this.require(input.id);
    user.passwordHash = input.passwordHash;
    user.tokenVersion += 1;
    return user;
  }

  async createEmailCode(input: CreateEmailCodeRepoInput): Promise<void> {
    this.codes.push({ ...input, id: `code-${this.codes.length + 1}`, consumedAt: null });
  }

  async findLatestEmailCode(input: FindEmailCodeRepoInput): Promise<EmailCodeRecord | null> {
    const matches = this.codes.filter(
      (code) =>
        code.userId === input.userId &&
        code.audience === input.audience &&
        code.purpose === input.purpose,
    );
    return matches.at(-1) ?? null;
  }

  async consumeEmailCode(id: string): Promise<void> {
    const code = this.codes.find((item) => item.id === id);
    if (code) {
      code.consumedAt = new Date();
    }
  }

  async createRefreshToken(input: CreateRefreshTokenRepoInput): Promise<void> {
    this.tokens.push({
      ...input,
      id: `token-${this.tokens.length + 1}`,
      revokedAt: null,
    });
  }

  async findRefreshToken(tokenHash: string): Promise<RefreshTokenRecord | null> {
    return this.tokens.find((token) => token.tokenHash === tokenHash) ?? null;
  }

  async revokeRefreshToken(id: string): Promise<void> {
    const token = this.tokens.find((item) => item.id === id);
    if (token) {
      token.revokedAt = new Date();
    }
  }

  async revokeAudienceRefreshTokens(input: RevokeAudienceTokensRepoInput): Promise<void> {
    for (const token of this.tokens) {
      if (token.userId === input.userId && token.audience === input.audience && !token.revokedAt) {
        token.revokedAt = new Date();
      }
    }
  }

  async revokeAllRefreshTokens(userId: string): Promise<void> {
    for (const token of this.tokens) {
      if (token.userId === userId && !token.revokedAt) {
        token.revokedAt = new Date();
      }
    }
  }

  async deleteById(id: string): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }

  override async findByPhone(phone: string): Promise<UserEntity | null> {
    return this.users.find((user) => user.profile?.phone === phone) ?? null;
  }

  override async completeProfile(input: CompleteProfileRepoInput): Promise<UserEntity> {
    const user = await this.require(input.userId);
    const profile = new ProfileEntity();
    profile.userId = user.id;
    profile.firstName = input.firstName;
    profile.lastName = input.lastName;
    profile.phone = input.phone;
    profile.phoneVerifiedAt = null;
    profile.birthYear = input.birthYear;
    profile.language = input.language;
    user.profile = profile;
    return user;
  }

  override async updateProfileContact(input: UpdateProfileContactRepoInput): Promise<UserEntity> {
    const user = await this.require(input.userId);
    if (!user.profile) {
      throw new Error('missing profile');
    }
    if (input.phone !== undefined) {
      user.profile.phone = input.phone;
    }
    if (input.clearPhoneVerified) {
      user.profile.phoneVerifiedAt = null;
    }
    if (input.language !== undefined) {
      user.profile.language = input.language;
    }
    return user;
  }

  private async require(id: string): Promise<UserEntity> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('missing user');
    }
    return user;
  }
}

class ImmediateTransactionRunner extends TransactionRunner {
  run<T>(work: (context: TransactionContext) => Promise<T>): Promise<T> {
    return work({});
  }
}

describe('UserService', () => {
  let repository: MemoryUserRepository;
  let service: UserService;

  beforeEach(() => {
    repository = new MemoryUserRepository();
    service = new UserService(repository, new ImmediateTransactionRunner());
  });

  it('rejects a password without letters and digits', async () => {
    await expect(
      service.signUp({
        email: 'person@example.com',
        password: 'aaaaaaaaaa',
        door: AuthDoor.Visitor,
        audience: ApiAudience.ClientApp,
      }),
    ).rejects.toMatchObject({ code: 'password_invalid' });
  });

  it('opens the visitor door and stores a hashed signup code', async () => {
    const actual = await service.signUp({
      email: 'Person@Example.com',
      password: 'Password123',
      door: AuthDoor.Visitor,
      audience: ApiAudience.ClientApp,
    });
    expect(actual.status).toBe('code_sent');
    expect(actual.code).toHaveLength(6);
    expect(repository.users[0].isVisitor).toBe(true);
    expect(repository.users[0].isOwner).toBe(false);
    expect(repository.codes[0].codeHash).toBe(hashSecret(actual.code ?? ''));
    expect(repository.codes[0].codeHash).not.toBe(actual.code);
  });

  it('refuses a staff email on both public doors', async () => {
    repository.users.push(
      buildUser({
        id: 'staff-1',
        email: 'staff@example.com',
        passwordHash: 'hash',
        isVisitor: false,
        isOwner: false,
        staffRole: StaffRole.Admin,
        emailVerifiedAt: new Date(),
      }),
    );
    await expect(
      service.signUp({
        email: 'staff@example.com',
        password: 'Password123',
        door: AuthDoor.Owner,
        audience: ApiAudience.DashboardOwner,
      }),
    ).rejects.toMatchObject({ code: 'staff_email' });
  });

  it('opens the visitor door on an owner when the password matches', async () => {
    const created = await service.signUp({
      email: 'owner@example.com',
      password: 'Password123',
      door: AuthDoor.Owner,
      audience: ApiAudience.DashboardOwner,
    });
    await service.verifyEmail({
      email: 'owner@example.com',
      code: created.code ?? '',
      audience: ApiAudience.DashboardOwner,
      purpose: EmailCodePurpose.Signup,
    });
    const actual = await service.signUp({
      email: 'owner@example.com',
      password: 'Password123',
      door: AuthDoor.Visitor,
      audience: ApiAudience.ClientApp,
    });
    expect(actual.status).toBe('ready');
    expect(repository.users[0].isVisitor).toBe(true);
    expect(repository.users[0].isOwner).toBe(true);
  });

  it('returns the same error for a wrong code and an expired code', async () => {
    const created = await service.signUp({
      email: 'person@example.com',
      password: 'Password123',
      door: AuthDoor.Visitor,
      audience: ApiAudience.ClientApp,
    });
    const wrong = service.verifyEmail({
      email: 'person@example.com',
      code: '000000',
      audience: ApiAudience.ClientApp,
      purpose: EmailCodePurpose.Signup,
    });
    await expect(wrong).rejects.toMatchObject({ code: 'invalid_code' });
    repository.codes[0].expiresAt = new Date(Date.now() - 1000);
    const expired = service.verifyEmail({
      email: 'person@example.com',
      code: created.code ?? '',
      audience: ApiAudience.ClientApp,
      purpose: EmailCodePurpose.Signup,
    });
    await expect(expired).rejects.toMatchObject({ code: 'invalid_code' });
  });

  it('does not bump the token version when one audience signs out', async () => {
    const created = await service.signUp({
      email: 'person@example.com',
      password: 'Password123',
      door: AuthDoor.Visitor,
      audience: ApiAudience.ClientApp,
    });
    await service.verifyEmail({
      email: 'person@example.com',
      code: created.code ?? '',
      audience: ApiAudience.ClientApp,
      purpose: EmailCodePurpose.Signup,
    });
    await service.saveRefreshToken({
      userId: repository.users[0].id,
      audience: ApiAudience.ClientApp,
      tokenHash: hashSecret('refresh-secret'),
      expiresAt: new Date(Date.now() + 60_000),
    });
    await service.revokeAudienceRefreshTokens({
      userId: repository.users[0].id,
      audience: ApiAudience.ClientApp,
    });
    expect(repository.users[0].tokenVersion).toBe(0);
    expect(repository.tokens[0].revokedAt).toBeInstanceOf(Date);
  });

  it('bumps the token version when the shared password changes', async () => {
    const created = await service.signUp({
      email: 'person@example.com',
      password: 'Password123',
      door: AuthDoor.Visitor,
      audience: ApiAudience.ClientApp,
    });
    await service.verifyEmail({
      email: 'person@example.com',
      code: created.code ?? '',
      audience: ApiAudience.ClientApp,
      purpose: EmailCodePurpose.Signup,
    });
    await service.changePassword({
      userId: repository.users[0].id,
      currentPassword: 'Password123',
      newPassword: 'Password456',
    });
    expect(repository.users[0].tokenVersion).toBe(1);
  });

  it('keeps the row when the other door is still open and drops only that audience', async () => {
    const created = await service.signUp({
      email: 'both@example.com',
      password: 'Password123',
      door: AuthDoor.Visitor,
      audience: ApiAudience.ClientApp,
    });
    await service.verifyEmail({
      email: 'both@example.com',
      code: created.code ?? '',
      audience: ApiAudience.ClientApp,
      purpose: EmailCodePurpose.Signup,
    });
    await service.signUp({
      email: 'both@example.com',
      password: 'Password123',
      door: AuthDoor.Owner,
      audience: ApiAudience.DashboardOwner,
    });
    await service.saveRefreshToken({
      userId: repository.users[0].id,
      audience: ApiAudience.ClientApp,
      tokenHash: 'visitor-hash',
      expiresAt: new Date(Date.now() + 60_000),
    });
    await service.saveRefreshToken({
      userId: repository.users[0].id,
      audience: ApiAudience.DashboardOwner,
      tokenHash: 'owner-hash',
      expiresAt: new Date(Date.now() + 60_000),
    });
    const actual = await service.deleteDoor({
      userId: repository.users[0].id,
      door: AuthDoor.Visitor,
      password: 'Password123',
      audience: ApiAudience.ClientApp,
    });
    expect(actual.removed).toBe(false);
    expect(repository.users).toHaveLength(1);
    expect(repository.users[0].isVisitor).toBe(false);
    expect(repository.users[0].isOwner).toBe(true);
    expect(repository.users[0].tokenVersion).toBe(0);
    expect(
      repository.tokens.find((token) => token.audience === ApiAudience.ClientApp)?.revokedAt,
    ).toBeInstanceOf(Date);
    expect(
      repository.tokens.find((token) => token.audience === ApiAudience.DashboardOwner)?.revokedAt,
    ).toBeNull();
  });

  it('removes the row when the last door closes', async () => {
    const created = await service.signUp({
      email: 'only@example.com',
      password: 'Password123',
      door: AuthDoor.Visitor,
      audience: ApiAudience.ClientApp,
    });
    await service.verifyEmail({
      email: 'only@example.com',
      code: created.code ?? '',
      audience: ApiAudience.ClientApp,
      purpose: EmailCodePurpose.Signup,
    });
    const actual = await service.deleteDoor({
      userId: repository.users[0].id,
      door: AuthDoor.Visitor,
      password: 'Password123',
      audience: ApiAudience.ClientApp,
    });
    expect(actual.removed).toBe(true);
    expect(repository.users).toHaveLength(0);
  });

  it('completes a profile once and refuses a child or a taken phone', async () => {
    const created = await service.signUp({
      email: 'profile@example.com',
      password: 'Password123',
      door: AuthDoor.Visitor,
      audience: ApiAudience.ClientApp,
    });
    await service.verifyEmail({
      email: 'profile@example.com',
      code: created.code ?? '',
      audience: ApiAudience.ClientApp,
      purpose: EmailCodePurpose.Signup,
    });
    const userId = repository.users[0].id;
    await expect(
      service.completeProfile({
        userId,
        firstName: 'Ahmad',
        lastName: 'Ali',
        phone: '0944000000',
        birthYear: 2015,
        language: ProfileLanguage.Arabic,
        now: new Date('2026-10-25T00:00:00Z'),
      }),
    ).rejects.toMatchObject({ code: 'too_young' });
    const actual = await service.completeProfile({
      userId,
      firstName: 'Ahmad',
      lastName: 'Ali',
      phone: '0944000000',
      birthYear: 2000,
      language: ProfileLanguage.Arabic,
      now: new Date('2026-10-25T00:00:00Z'),
    });
    expect(actual.profile?.phone).toBe('+963944000000');
    await expect(
      service.completeProfile({
        userId,
        firstName: 'Ahmad',
        lastName: 'Ali',
        phone: '0944000001',
        birthYear: 2000,
        language: ProfileLanguage.Arabic,
      }),
    ).rejects.toMatchObject({ code: 'profile_already_complete' });
  });

  it('stores a new phone as unverified and can change language alone', async () => {
    const created = await service.signUp({
      email: 'edit@example.com',
      password: 'Password123',
      door: AuthDoor.Visitor,
      audience: ApiAudience.ClientApp,
    });
    await service.verifyEmail({
      email: 'edit@example.com',
      code: created.code ?? '',
      audience: ApiAudience.ClientApp,
      purpose: EmailCodePurpose.Signup,
    });
    const userId = repository.users[0].id;
    await service.completeProfile({
      userId,
      firstName: 'Ahmad',
      lastName: 'Ali',
      phone: '0944000000',
      birthYear: 2000,
      language: ProfileLanguage.Arabic,
      now: new Date('2026-10-25T00:00:00Z'),
    });
    repository.users[0].profile!.phoneVerifiedAt = new Date();
    const actual = await service.updateProfileContact({
      userId,
      phone: '0944111111',
      language: ProfileLanguage.English,
    });
    expect(actual.profile?.phone).toBe('+963944111111');
    expect(actual.profile?.phoneVerifiedAt).toBeNull();
    expect(actual.profile?.language).toBe(ProfileLanguage.English);
    expect(actual.profile?.firstName).toBe('Ahmad');
  });

  it('sets only the visitor flag for Google', async () => {
    const actual = await service.signInWithGoogleEmail({ email: 'google@example.com' });
    expect(actual.isVisitor).toBe(true);
    expect(actual.isOwner).toBe(false);
    expect(actual.passwordHash).toBeNull();
    expect(actual.emailVerifiedAt).toBeInstanceOf(Date);
  });
});

function buildUser(input: {
  id: string;
  email: string;
  passwordHash: string | null;
  isVisitor: boolean;
  isOwner: boolean;
  staffRole?: StaffRole | null;
  emailVerifiedAt?: Date | null;
}): UserEntity {
  return new UserEntity({
    id: input.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    email: input.email,
    passwordHash: input.passwordHash,
    tokenVersion: 0,
    emailVerifiedAt: input.emailVerifiedAt ?? null,
    isVisitor: input.isVisitor,
    isOwner: input.isOwner,
    staffRole: input.staffRole ?? null,
    profile: null,
  });
}
