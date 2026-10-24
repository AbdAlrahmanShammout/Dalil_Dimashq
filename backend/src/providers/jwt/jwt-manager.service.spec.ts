import { JwtConfigService } from '@/config/jwt/jwt-config.service';
import { ApiAudience } from '@/common/auth/principal.interface';
import { JwtManagerService } from '@/providers/jwt/jwt-manager.service';

describe('JwtManagerService', () => {
  it('signs a token that carries the audience and token version', () => {
    const config = {
      accessSecret: 'test-access-secret-value',
      accessTtlSeconds: 900,
    } as JwtConfigService;
    const service = new JwtManagerService(config);
    const token = service.signAccess({
      subject: 'user-1',
      audience: ApiAudience.ClientApp,
      tokenVersion: 3,
    });
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8')) as {
      sub: string;
      aud: string;
      tokenVersion: number;
    };
    expect(payload).toMatchObject({ sub: 'user-1', aud: 'client-app', tokenVersion: 3 });
  });
});
