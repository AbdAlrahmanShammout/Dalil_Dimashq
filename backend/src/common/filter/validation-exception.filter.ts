import { ArgumentsHost, Catch, ExceptionFilter, Injectable } from '@nestjs/common';

import { ValidationExceptions } from '@/common/exceptions/validation.exception';
import { normalizeException } from '@/common/filter/exception_mappers/exception-mapper';
import { formatHttpExceptionResponse } from '@/common/filter/exception_return_handler/http-exception.handler';

@Catch(ValidationExceptions)
@Injectable()
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationExceptions, host: ArgumentsHost): void {
    formatHttpExceptionResponse(normalizeException(exception), host);
  }
}
