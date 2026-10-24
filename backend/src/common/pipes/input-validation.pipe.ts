import { Injectable, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { ValidationErrorObject } from '@/common/exceptions/validation-error-object';
import { ValidationExceptions } from '@/common/exceptions/validation.exception';

@Injectable()
export class InputValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (validationErrors: ValidationError[]) =>
        new ValidationExceptions({
          message: 'Invalid input',
          code: 'BAD_USER_INPUT',
          validationErrorObjects: InputValidationPipe.flattenErrors(validationErrors),
        }),
    });
  }

  private static flattenErrors(
    errors: readonly ValidationError[],
    parent = '',
  ): ValidationErrorObject[] {
    return errors.flatMap((error) => {
      const property = parent.length > 0 ? `${parent}.${error.property}` : error.property;
      const current: ValidationErrorObject[] = error.constraints
        ? [{ property, constraints: error.constraints }]
        : [];
      const children = error.children?.length
        ? InputValidationPipe.flattenErrors(error.children, property)
        : [];
      return [...current, ...children];
    });
  }
}
