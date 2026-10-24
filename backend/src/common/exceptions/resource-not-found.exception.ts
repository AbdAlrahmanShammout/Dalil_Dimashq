import { AppException } from '@/common/exceptions/app.exception';
import { ErrorKind } from '@/common/exceptions/error-kind.enum';

export class ResourceNotFoundException extends AppException {
  constructor(resource: string, identifier: string | number) {
    super({
      message: `${resource} with identifier ${identifier} was not found`,
      code: 'not_found',
      kind: ErrorKind.NOT_FOUND,
      userFriendly: true,
    });
  }
}
