import { ConfigService } from '@nestjs/config';

import { BaseConfigService } from '@/config/base-config.service';

describe('BaseConfigService', () => {
  it('returns a configured value', () => {
    const configService = { get: jest.fn().mockReturnValue('local') } as unknown as ConfigService;
    const service = new BaseConfigService(configService);
    expect(service.getValue<string>('app.env')).toBe('local');
  });

  it('throws when a key is missing', () => {
    const configService = { get: jest.fn().mockReturnValue(undefined) } as unknown as ConfigService;
    const service = new BaseConfigService(configService);
    expect(() => service.getValue('app.env')).toThrow('Missing configuration key: app.env');
  });
});
