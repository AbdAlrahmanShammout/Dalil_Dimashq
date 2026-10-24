import { ApiAudience } from '@/common/auth/principal.interface';
import { AuthDoor, EmailCodePurpose, StaffRole } from '@/modules/user/enum/general.enum';

export interface CreateUserRepoInput {
  readonly email: string;
  readonly passwordHash: string | null;
  readonly isVisitor: boolean;
  readonly isOwner: boolean;
  readonly emailVerifiedAt?: Date | null;
  readonly staffRole?: StaffRole | null;
}

export interface UpdateDoorRepoInput {
  readonly id: string;
  readonly isVisitor?: boolean;
  readonly isOwner?: boolean;
  readonly emailVerifiedAt?: Date | null;
}

export interface UpdatePasswordRepoInput {
  readonly id: string;
  readonly passwordHash: string;
}

export interface CreateEmailCodeRepoInput {
  readonly userId: string;
  readonly audience: ApiAudience;
  readonly purpose: EmailCodePurpose;
  readonly codeHash: string;
  readonly expiresAt: Date;
}

export interface FindEmailCodeRepoInput {
  readonly userId: string;
  readonly audience: ApiAudience;
  readonly purpose: EmailCodePurpose;
}

export interface EmailCodeRecord {
  readonly id: string;
  readonly codeHash: string;
  readonly expiresAt: Date;
  readonly consumedAt: Date | null;
}

export interface CreateRefreshTokenRepoInput {
  readonly userId: string;
  readonly audience: ApiAudience;
  readonly tokenHash: string;
  readonly expiresAt: Date;
}

export interface RefreshTokenRecord {
  readonly id: string;
  readonly userId: string;
  readonly audience: string;
  readonly expiresAt: Date;
  readonly revokedAt: Date | null;
}

export interface RevokeAudienceTokensRepoInput {
  readonly userId: string;
  readonly audience: ApiAudience;
}

export interface SignUpServiceInput {
  readonly email: string;
  readonly password: string;
  readonly door: AuthDoor;
  readonly audience: ApiAudience;
}

export interface SignUpResult {
  readonly status: 'code_sent' | 'ready';
  readonly email: string;
  readonly code?: string;
}

export interface VerifyEmailServiceInput {
  readonly email: string;
  readonly code: string;
  readonly audience: ApiAudience;
  readonly purpose: EmailCodePurpose;
}

export interface AuthenticateServiceInput {
  readonly email: string;
  readonly password: string;
  readonly door: AuthDoor;
}

export interface PasswordResetCodeResult {
  readonly email: string;
  readonly code: string;
}

export interface ResetPasswordServiceInput {
  readonly email: string;
  readonly code: string;
  readonly password: string;
  readonly audience: ApiAudience;
  readonly door: AuthDoor;
}

export interface ChangePasswordServiceInput {
  readonly userId: string;
  readonly currentPassword: string;
  readonly newPassword: string;
}

export interface GoogleSignInServiceInput {
  readonly email: string;
}

export interface RotateRefreshTokenServiceInput {
  readonly refreshToken: string;
  readonly audience: ApiAudience;
  readonly nextTokenHash: string;
  readonly nextExpiresAt: Date;
}
