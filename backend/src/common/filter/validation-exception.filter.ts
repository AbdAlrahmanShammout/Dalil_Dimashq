import { ArgumentsHost, Catch, ExceptionFilter, Injectable } from '@nestjs/common';

import { ValidationExceptions } from '@/common/exceptions/validation.exception';
import { applyErrorText } from '@/common/filter/apply-error-text';
import { normalizeException } from '@/common/filter/exception_mappers/exception-mapper';
import { formatHttpExceptionResponse } from '@/common/filter/exception_return_handler/http-exception.handler';
import { resolveErrorLanguage } from '@/common/filter/resolve-error-language';

@Catch(ValidationExceptions)
@Injectable()
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationExceptions, host: ArgumentsHost): void {
    const request = host.switchToHttp().getRequest<{ headers?: { 'accept-language'?: string } }>();
    const language = resolveErrorLanguage(request.headers?.['accept-language']);
    formatHttpExceptionResponse(
      applyErrorText(normalizeException(exception), language, true),
      host,
    );
  }
}
