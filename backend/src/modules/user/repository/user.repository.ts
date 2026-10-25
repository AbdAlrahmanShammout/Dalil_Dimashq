import { TransactionContext } from '@/common/base/transaction-runner';
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
import { ProfileLanguage } from '@/modules/user/enum/general.enum';

export interface CompleteProfileRepoInput {
  readonly userId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
  readonly birthYear: number;
  readonly language: ProfileLanguage;
}

export interface UpdateProfileContactRepoInput {
  readonly userId: string;
  readonly phone?: string;
  readonly clearPhoneVerified: boolean;
  readonly language?: ProfileLanguage;
}

export interface CreateProfileChangeRepoInput {
  readonly userId: string;
  readonly kind: 'name' | 'birth_year';
  readonly firstName: string | null;
  readonly lastName: string | null;
  readonly birthYear: number | null;
}

export abstract class UserRepository {
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract create(input: CreateUserRepoInput, context?: TransactionContext): Promise<UserEntity>;
  abstract updateDoor(
    input: UpdateDoorRepoInput,
    context?: TransactionContext,
  ): Promise<UserEntity>;
  abstract updatePassword(
    input: UpdatePasswordRepoInput,
    context?: TransactionContext,
  ): Promise<UserEntity>;
  abstract createEmailCode(
    input: CreateEmailCodeRepoInput,
    context?: TransactionContext,
  ): Promise<void>;
  abstract findLatestEmailCode(input: FindEmailCodeRepoInput): Promise<EmailCodeRecord | null>;
  abstract consumeEmailCode(id: string, context?: TransactionContext): Promise<void>;
  abstract createRefreshToken(
    input: CreateRefreshTokenRepoInput,
    context?: TransactionContext,
  ): Promise<void>;
  abstract findRefreshToken(tokenHash: string): Promise<RefreshTokenRecord | null>;
  abstract revokeRefreshToken(id: string, context?: TransactionContext): Promise<void>;
  abstract revokeAudienceRefreshTokens(
    input: RevokeAudienceTokensRepoInput,
    context?: TransactionContext,
  ): Promise<void>;
  abstract revokeAllRefreshTokens(userId: string, context?: TransactionContext): Promise<void>;
  abstract deleteById(id: string, context?: TransactionContext): Promise<void>;
  findByPhone(_phone: string): Promise<UserEntity | null> {
    return Promise.resolve(null);
  }
  completeProfile(_input: CompleteProfileRepoInput): Promise<UserEntity> {
    return Promise.reject(new Error('completeProfile is not implemented'));
  }
  updateProfileContact(_input: UpdateProfileContactRepoInput): Promise<UserEntity> {
    return Promise.reject(new Error('updateProfileContact is not implemented'));
  }
  hasPendingProfileChange(_userId: string): Promise<boolean> {
    return Promise.resolve(false);
  }
  createProfileChange(_input: CreateProfileChangeRepoInput): Promise<{ id: string }> {
    return Promise.resolve({ id: 'change-1' });
  }
}
