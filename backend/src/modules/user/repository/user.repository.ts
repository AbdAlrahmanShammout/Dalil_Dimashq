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
}
