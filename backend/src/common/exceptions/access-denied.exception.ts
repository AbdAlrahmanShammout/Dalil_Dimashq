import { AppException, AppExceptionInput } from '@/common/exceptions/app.exception';
import { ErrorKind } from '@/common/exceptions/error-kind.enum';

type SemanticExceptionInput = Omit<AppExceptionInput, 'kind'>;

export class AccessDeniedException extends AppException {
  constructor(input: SemanticExceptionInput = { message: 'Access denied', code: 'not_allowed' }) {
    super({ userFriendly: true, ...input, kind: ErrorKind.ACCESS_DENIED });
  }
}
