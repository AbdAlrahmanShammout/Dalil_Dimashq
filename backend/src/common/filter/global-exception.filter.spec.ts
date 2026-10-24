import { ArgumentsHost, HttpStatus } from '@nestjs/common';

import { ConflictException } from '@/common/exceptions/conflict.exception';
import { GlobalExceptionFilter } from '@/common/filter/global-exception.filter';
import { AppConfigService } from '@/config/app/app-config.service';
import { Environment } from '@/config/environment';

function createHost(acceptLanguage?: string): {
  host: ArgumentsHost;
  body: unknown;
  statusCode: number;
} {
  const capture: { body: unknown; statusCode: number } = { body: undefined, statusCode: 0 };
  const host = {
    switchToHttp: () => ({
      getRequest: () => ({ headers: { 'accept-language': acceptLanguage } }),
      getResponse: () => ({
        status: (statusCode: number) => ({
          json: (body: unknown) => {
            capture.statusCode = statusCode;
            capture.body = body;
          },
        }),
      }),
    }),
  } as unknown as ArgumentsHost;
  return {
    host,
    ...capture,
    get body() {
      return capture.body;
    },
    get statusCode() {
      return capture.statusCode;
    },
  };
}

describe('GlobalExceptionFilter', () => {
  it('hides internal messages outside development-like environments', () => {
    const appConfigService = {
      isDevelopmentLike: false,
      env: Environment.Production,
    } as AppConfigService;
    const filter = new GlobalExceptionFilter(appConfigService);
    const capture = createHost();
    filter.catch(new Error('secret connection string'), capture.host);
    expect(capture.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(capture.body).toEqual({
      message: 'حدث خطأ، يرجى المحاولة مرة أخرى.',
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });

  it('keeps the internal message in a development-like environment', () => {
    const appConfigService = {
      isDevelopmentLike: true,
      env: Environment.Local,
    } as AppConfigService;
    const filter = new GlobalExceptionFilter(appConfigService);
    const capture = createHost();
    filter.catch(new Error('secret connection string'), capture.host);
    expect(capture.body).toMatchObject({
      message: 'secret connection string',
      code: 'INTERNAL_SERVER_ERROR',
    });
  });

  it('uses English text when Accept-Language prefers English', () => {
    const appConfigService = {
      isDevelopmentLike: false,
      env: Environment.Production,
    } as AppConfigService;
    const filter = new GlobalExceptionFilter(appConfigService);
    const capture = createHost('en');
    filter.catch(new Error('secret connection string'), capture.host);
    expect(capture.body).toMatchObject({
      message: 'Something went wrong, please try again.',
      code: 'INTERNAL_SERVER_ERROR',
    });
  });

  it('localizes a stable code such as phone_taken', () => {
    const appConfigService = {
      isDevelopmentLike: true,
      env: Environment.Local,
    } as AppConfigService;
    const filter = new GlobalExceptionFilter(appConfigService);
    const capture = createHost('ar');
    filter.catch(new ConflictException({ message: 'taken', code: 'phone_taken' }), capture.host);
    expect(capture.body).toMatchObject({
      message: 'هذا الرقم مستخدم في حساب آخر.',
      code: 'phone_taken',
      statusCode: HttpStatus.CONFLICT,
    });
  });
});
