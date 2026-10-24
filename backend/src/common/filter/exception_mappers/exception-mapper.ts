import { HttpException, HttpStatus } from '@nestjs/common';

import { AppException } from '@/common/exceptions/app.exception';
import { ValidationExceptions } from '@/common/exceptions/validation.exception';
import { GeneralTypeException } from '@/common/filter/exception_return_handler/type/general-type.exception';
import {
  kindToStatus,
  mapPrismaException,
} from '@/common/filter/exception_mappers/prisma-exception-handler';

function tryMapSpecialExceptions(exception: unknown): GeneralTypeException | null {
  return mapPrismaException(exception);
}

function fromAppException(exception: AppException): GeneralTypeException {
  const validationErrorObjects =
    exception instanceof ValidationExceptions ? exception.validationErrorObjects : undefined;
  return new GeneralTypeException({
    message: exception.message,
    code: exception.code,
    statusCode: kindToStatus(exception.kind),
    userFriendly: exception.userFriendly,
    includeStack: !exception.userFriendly,
    stack: exception.stack,
    validationErrorObjects,
  });
}

function readHttpMessage(exception: HttpException): string {
  const response = exception.getResponse();
  if (typeof response === 'string') {
    return response;
  }
  if (typeof response === 'object' && response !== null && 'message' in response) {
    const message = (response as { message?: unknown }).message;
    if (typeof message === 'string') {
      return message;
    }
    if (Array.isArray(message) && typeof message[0] === 'string') {
      return message[0];
    }
  }
  return exception.message;
}

function fromHttpException(exception: HttpException): GeneralTypeException {
  const statusCode = exception.getStatus();
  return new GeneralTypeException({
    message: readHttpMessage(exception),
    code: statusCode === HttpStatus.TOO_MANY_REQUESTS ? 'too_many_requests' : 'http_error',
    statusCode,
    userFriendly: statusCode < HttpStatus.INTERNAL_SERVER_ERROR,
    includeStack: statusCode >= HttpStatus.INTERNAL_SERVER_ERROR,
    stack: exception.stack,
  });
}

export function normalizeException(exception: unknown): GeneralTypeException {
  const mapped = tryMapSpecialExceptions(exception);
  if (mapped) {
    return mapped;
  }
  if (exception instanceof AppException) {
    return fromAppException(exception);
  }
  if (exception instanceof HttpException) {
    return fromHttpException(exception);
  }
  return new GeneralTypeException({
    message: exception instanceof Error ? exception.message : 'Unknown Error',
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    userFriendly: false,
    includeStack: true,
    stack: exception instanceof Error ? exception.stack : undefined,
  });
}
