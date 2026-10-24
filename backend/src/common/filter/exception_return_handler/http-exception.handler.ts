import { ArgumentsHost } from '@nestjs/common';

import { GeneralTypeException } from '@/common/filter/exception_return_handler/type/general-type.exception';

export interface HttpExceptionResponseBody {
  message: string;
  code: string;
  statusCode: number;
  stack?: string;
  validationErrorObjects?: readonly {
    property: string;
    constraints: Readonly<Record<string, string>>;
  }[];
}

interface HttpResponseWriter {
  status(statusCode: number): { json(body: HttpExceptionResponseBody): void };
}

export function formatHttpExceptionResponse(
  exception: GeneralTypeException,
  host: ArgumentsHost,
): void {
  const response = host.switchToHttp().getResponse<HttpResponseWriter>();
  const body: HttpExceptionResponseBody = {
    message: exception.message,
    code: exception.code,
    statusCode: exception.statusCode,
  };
  if (exception.includeStack && exception.stack) {
    body.stack = exception.stack;
  }
  if (exception.validationErrorObjects) {
    body.validationErrorObjects = exception.validationErrorObjects;
  }
  response.status(exception.statusCode).json(body);
}
