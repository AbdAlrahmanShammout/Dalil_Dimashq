import { AppException } from '@/common/exceptions/app.exception';
import { ErrorKind } from '@/common/exceptions/error-kind.enum';
import { ValidationErrorObject } from '@/common/exceptions/validation-error-object';

export interface GeneralTypeExceptionInput {
  readonly message: string;
  readonly code: string;
  readonly statusCode: number;
  readonly userFriendly: boolean;
  readonly includeStack?: boolean;
  readonly stack?: string;
  readonly validationErrorObjects?: readonly ValidationErrorObject[];
}

export class GeneralTypeException extends AppException {
  readonly statusCode: number;
  readonly includeStack: boolean;
  readonly validationErrorObjects?: readonly ValidationErrorObject[];

  constructor(input: GeneralTypeExceptionInput) {
    super({
      message: input.message,
      code: input.code,
      kind: ErrorKind.INTERNAL,
      userFriendly: input.userFriendly,
    });
    this.statusCode = input.statusCode;
    this.includeStack = input.includeStack ?? false;
    this.validationErrorObjects = input.validationErrorObjects;
    if (input.stack) {
      this.stack = input.stack;
    }
  }
}
