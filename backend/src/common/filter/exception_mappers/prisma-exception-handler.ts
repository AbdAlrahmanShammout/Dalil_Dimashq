import { HttpStatus } from '@nestjs/common';

import { ErrorKind } from '@/common/exceptions/error-kind.enum';
import { GeneralTypeException } from '@/common/filter/exception_return_handler/type/general-type.exception';

const UNIQUE_VIOLATION = 'P2002';
const FOREIGN_KEY_VIOLATION = 'P2003';
const RECORD_NOT_FOUND = 'P2025';
const QUERY_TIMEOUT = 'P2024';
const SCHEMA_ERROR_CODES = ['P2021', 'P2022'] as const;

interface PrismaKnownRequestLike {
  readonly name: string;
  readonly code: string;
  readonly message: string;
  readonly meta?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readName(exception: unknown): string | undefined {
  if (!isRecord(exception) || typeof exception.name !== 'string') {
    return undefined;
  }
  return exception.name;
}

export function mapPrismaException(exception: unknown): GeneralTypeException | null {
  const name = readName(exception);
  if (
    name === 'PrismaClientKnownRequestError' &&
    isRecord(exception) &&
    typeof exception.code === 'string'
  ) {
    return mapKnownRequest(exception as unknown as PrismaKnownRequestLike);
  }
  if (name === 'PrismaClientValidationError') {
    return new GeneralTypeException({
      message: 'Invalid data',
      code: 'validation_failed',
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      userFriendly: true,
    });
  }
  if (name === 'PrismaClientInitializationError') {
    return new GeneralTypeException({
      message: 'Database is unavailable',
      code: 'dependency_failure',
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      userFriendly: false,
      includeStack: true,
      stack: exception instanceof Error ? exception.stack : undefined,
    });
  }
  if (name === 'PrismaClientUnknownRequestError') {
    return new GeneralTypeException({
      message: exception instanceof Error ? exception.message : 'Unknown database error',
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      userFriendly: false,
      includeStack: true,
      stack: exception instanceof Error ? exception.stack : undefined,
    });
  }
  return null;
}

function mapKnownRequest(exception: PrismaKnownRequestLike): GeneralTypeException {
  if (exception.code === UNIQUE_VIOLATION) {
    return new GeneralTypeException({
      message: 'A matching record already exists',
      code: 'conflict',
      statusCode: HttpStatus.CONFLICT,
      userFriendly: true,
    });
  }
  if (exception.code === RECORD_NOT_FOUND) {
    return new GeneralTypeException({
      message: 'Record was not found',
      code: 'not_found',
      statusCode: HttpStatus.NOT_FOUND,
      userFriendly: true,
    });
  }
  if (exception.code === FOREIGN_KEY_VIOLATION) {
    return new GeneralTypeException({
      message: 'The related record is missing',
      code: 'invalid_state',
      statusCode: HttpStatus.BAD_REQUEST,
      userFriendly: true,
    });
  }
  if (exception.code === QUERY_TIMEOUT) {
    return new GeneralTypeException({
      message: 'Database timed out',
      code: 'dependency_failure',
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      userFriendly: false,
      includeStack: true,
      stack: exception.message,
    });
  }
  if (SCHEMA_ERROR_CODES.includes(exception.code as (typeof SCHEMA_ERROR_CODES)[number])) {
    return new GeneralTypeException({
      message: exception.message,
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      userFriendly: false,
      includeStack: true,
      stack: exception.message,
    });
  }
  return new GeneralTypeException({
    message: exception.message,
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    userFriendly: false,
    includeStack: true,
    stack: exception.message,
  });
}

export function kindToStatus(kind: ErrorKind): number {
  if (kind === ErrorKind.VALIDATION) return HttpStatus.UNPROCESSABLE_ENTITY;
  if (kind === ErrorKind.NOT_FOUND) return HttpStatus.NOT_FOUND;
  if (kind === ErrorKind.CONFLICT) return HttpStatus.CONFLICT;
  if (kind === ErrorKind.INVALID_STATE) return HttpStatus.BAD_REQUEST;
  if (kind === ErrorKind.UNAUTHENTICATED) return HttpStatus.UNAUTHORIZED;
  if (kind === ErrorKind.ACCESS_DENIED) return HttpStatus.FORBIDDEN;
  if (kind === ErrorKind.DEPENDENCY_FAILURE) return HttpStatus.SERVICE_UNAVAILABLE;
  return HttpStatus.INTERNAL_SERVER_ERROR;
}
