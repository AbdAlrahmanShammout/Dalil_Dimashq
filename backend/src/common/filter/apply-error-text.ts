import { ERROR_TEXT } from '@/common/filter/error-text';
import { GeneralTypeException } from '@/common/filter/exception_return_handler/type/general-type.exception';

export function applyErrorText(
  exception: GeneralTypeException,
  language: 'ar' | 'en',
  shouldLocalize: boolean,
): GeneralTypeException {
  const text = ERROR_TEXT[exception.code];
  if (!shouldLocalize || !text) {
    return exception;
  }
  return new GeneralTypeException({
    message: text[language],
    code: exception.code,
    statusCode: exception.statusCode,
    userFriendly: exception.userFriendly,
    includeStack: exception.includeStack,
    stack: exception.stack,
    validationErrorObjects: exception.validationErrorObjects,
  });
}
