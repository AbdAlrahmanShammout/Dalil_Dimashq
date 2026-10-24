import { validateEnvironment } from '@/config/validate-environment';

const required = {
  DATABASE_URL: 'postgresql://dalil:dalil@localhost:5432/dalil',
  JWT_ACCESS_SECRET: 'access-secret-value',
  JWT_REFRESH_SECRET: 'refresh-secret-value',
};

describe('validateEnvironment', () => {
  it('allows operating-system variables and applies defaults', () => {
    const actual = validateEnvironment({ ...required, PATH: '/usr/bin' }, {});
    expect(actual.APP_PORT).toBe(3000);
    expect(actual.PATH).toBeUndefined();
  });

  it('rejects an unknown key in the env file', () => {
    expect(() => validateEnvironment(required, { TYPO_FLAG: '1' })).toThrow(/TYPO_FLAG/);
  });

  it('rejects a missing secret', () => {
    expect(() => validateEnvironment({ PATH: '/usr/bin' }, {})).toThrow(/DATABASE_URL/);
  });
});
