import { ErrorKind } from '@/common/exceptions/error-kind.enum';

export interface AppExceptionInput {
  readonly message: string;
  readonly code?: string;
  readonly kind?: ErrorKind;
  readonly userFriendly?: boolean;
}

export class AppException extends Error {
  readonly code: string;
  readonly kind: ErrorKind;
  readonly userFriendly: boolean;

  constructor(input: AppExceptionInput) {
    const {
      message,
      code = 'UNKNOWN_CODE',
      kind = ErrorKind.INTERNAL,
      userFriendly = false,
    } = input;
    super(message);
    this.code = code;
    this.kind = kind;
    this.userFriendly = userFriendly;
  }
}
