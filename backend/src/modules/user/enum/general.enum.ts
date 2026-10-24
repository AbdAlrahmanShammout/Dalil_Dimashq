export const PASSWORD_MIN_LENGTH = 10;
export const BCRYPT_ROUNDS = 10;
export const EMAIL_CODE_LENGTH = 6;
export const EMAIL_CODE_TTL_MS = 15 * 60 * 1000;

export enum StaffRole {
  Admin = 'admin',
  Editor = 'editor',
  Moderator = 'moderator',
  Sales = 'sales',
}

export enum ProfileLanguage {
  Arabic = 'ar',
  English = 'en',
}

export enum AuthDoor {
  Visitor = 'visitor',
  Owner = 'owner',
}

export enum EmailCodePurpose {
  Signup = 'signup',
  PasswordReset = 'password_reset',
}
