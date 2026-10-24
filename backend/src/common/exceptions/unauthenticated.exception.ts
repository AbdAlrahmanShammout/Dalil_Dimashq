import { AppException, AppExceptionInput } from '@/common/exceptions/app.exception';
import { ErrorKind } from '@/common/exceptions/error-kind.enum';

type SemanticExceptionInput = Omit<AppExceptionInput, 'kind'>;

export class UnauthenticatedException extends AppException {
  constructor(
    input: SemanticExceptionInput = { message: 'Authentication failed', code: 'not_signed_in' },
  ) {
    super({ userFriendly: true, ...input, kind: ErrorKind.UNAUTHENTICATED });
  }
}
