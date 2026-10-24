import { AppException } from '@/common/exceptions/app.exception';
import { ErrorKind } from '@/common/exceptions/error-kind.enum';
import {
  ValidationErrorObject,
  ValidationExceptionInput,
} from '@/common/exceptions/validation-error-object';

export class ValidationExceptions extends AppException {
  readonly validationErrorObjects: readonly ValidationErrorObject[];

  constructor(input: ValidationExceptionInput) {
    super({
      message: input.message,
      code: input.code ?? 'BAD_USER_INPUT',
      kind: ErrorKind.VALIDATION,
      userFriendly: true,
    });
    this.validationErrorObjects = input.validationErrorObjects;
  }
}
