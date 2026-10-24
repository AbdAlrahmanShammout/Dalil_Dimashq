import { isSwaggerEnabled } from '@/providers/swagger/swagger.provider';
import { SWAGGER_DOCUMENT_DEFINITIONS } from '@/providers/swagger/swagger-document.definitions';

describe('swagger', () => {
  it('publishes one document per audience', () => {
    expect(SWAGGER_DOCUMENT_DEFINITIONS.map((definition) => definition.name)).toEqual([
      'client-app',
      'dashboard-owner',
      'admin-panel',
    ]);
  });

  it('stays off outside development or when the flag is false', () => {
    expect(isSwaggerEnabled(false, true)).toBe(false);
    expect(isSwaggerEnabled(true, false)).toBe(false);
    expect(isSwaggerEnabled(true, true)).toBe(true);
  });
});
