import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';

import { AppConfigService } from '@/config/app/app-config.service';
import { formatHttpExceptionResponse } from '@/common/filter/exception_return_handler/http-exception.handler';
import { GeneralTypeException } from '@/common/filter/exception_return_handler/type/general-type.exception';
import { normalizeException } from '@/common/filter/exception_mappers/exception-mapper';

const SAFE_INTERNAL_MESSAGE = 'Something went wrong, please try again.';

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly appConfigService: AppConfigService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    let normalized = normalizeException(exception);
    this.logError(normalized);
    if (!normalized.userFriendly && this.shouldHideErrorDetails()) {
      normalized = this.createSafeProductionError(normalized);
    }
    formatHttpExceptionResponse(normalized, host);
  }

  private logError(exception: GeneralTypeException): void {
    this.logger.error(`${exception.code} ${exception.message}`, exception.stack);
  }

  private shouldHideErrorDetails(): boolean {
    return !this.appConfigService.isDevelopmentLike;
  }

  private createSafeProductionError(exception: GeneralTypeException): GeneralTypeException {
    if (exception.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      return new GeneralTypeException({
        message: SAFE_INTERNAL_MESSAGE,
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        userFriendly: false,
      });
    }
    return new GeneralTypeException({
      message: 'Resource was not found',
      code: 'not_found',
      statusCode: HttpStatus.NOT_FOUND,
      userFriendly: true,
    });
  }
}
