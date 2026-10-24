import { HttpException, HttpStatus } from '@nestjs/common';

import { ConflictException } from '@/common/exceptions/conflict.exception';
import { ErrorKind } from '@/common/exceptions/error-kind.enum';
import { ValidationExceptions } from '@/common/exceptions/validation.exception';
import { normalizeException } from '@/common/filter/exception_mappers/exception-mapper';

describe('normalizeException', () => {
  it('maps an application conflict to 409 and hides kind', () => {
    const actual = normalizeException(
      new ConflictException({ message: 'Email is taken', code: 'email_taken' }),
    );
    expect(actual.statusCode).toBe(HttpStatus.CONFLICT);
    expect(actual.code).toBe('email_taken');
    expect(actual.kind).toBe(ErrorKind.INTERNAL);
    expect(actual).not.toHaveProperty('statusCode', undefined);
  });

  it('maps validation exceptions to 422 with field errors', () => {
    const actual = normalizeException(
      new ValidationExceptions({
        message: 'Invalid input',
        validationErrorObjects: [{ property: 'email', constraints: { isEmail: 'invalid' } }],
      }),
    );
    expect(actual.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(actual.validationErrorObjects).toEqual([
      { property: 'email', constraints: { isEmail: 'invalid' } },
    ]);
  });

  it('maps a unique Prisma error to conflict', () => {
    const actual = normalizeException({
      name: 'PrismaClientKnownRequestError',
      code: 'P2002',
      message: 'Unique constraint failed',
    });
    expect(actual.statusCode).toBe(HttpStatus.CONFLICT);
    expect(actual.code).toBe('conflict');
    expect(actual.userFriendly).toBe(true);
  });

  it('maps a missing Prisma record to not found', () => {
    const actual = normalizeException({
      name: 'PrismaClientKnownRequestError',
      code: 'P2025',
      message: 'Record not found',
    });
    expect(actual.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(actual.code).toBe('not_found');
  });

  it('maps an unknown error to a sanitized 500', () => {
    const actual = normalizeException(new TypeError('cannot read property'));
    expect(actual.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(actual.code).toBe('INTERNAL_SERVER_ERROR');
    expect(actual.userFriendly).toBe(false);
  });

  it('keeps the framework status for an HttpException', () => {
    const actual = normalizeException(new HttpException('slow down', HttpStatus.TOO_MANY_REQUESTS));
    expect(actual.statusCode).toBe(HttpStatus.TOO_MANY_REQUESTS);
    expect(actual.code).toBe('too_many_requests');
  });
});
