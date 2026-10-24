import { AppException, AppExceptionInput } from '@/common/exceptions/app.exception';
import { ErrorKind } from '@/common/exceptions/error-kind.enum';

type SemanticExceptionInput = Omit<AppExceptionInput, 'kind'>;

export class DependencyFailureException extends AppException {
  constructor(input: SemanticExceptionInput) {
    super({ userFriendly: false, ...input, kind: ErrorKind.DEPENDENCY_FAILURE });
  }
}
