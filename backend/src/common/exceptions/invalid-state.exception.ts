import { AppException, AppExceptionInput } from '@/common/exceptions/app.exception';
import { ErrorKind } from '@/common/exceptions/error-kind.enum';

type SemanticExceptionInput = Omit<AppExceptionInput, 'kind'>;

export class InvalidStateException extends AppException {
  constructor(input: SemanticExceptionInput) {
    super({ userFriendly: true, ...input, kind: ErrorKind.INVALID_STATE });
  }
}
