import { FirebaseConfigService } from '@/config/firebase/firebase-config.service';
import { FirebaseHttpService } from '@/providers/firebase/firebase-http.service';

describe('FirebaseHttpService', () => {
  it('skips the send when Firebase is not configured', async () => {
    const config = { isConfigured: false } as FirebaseConfigService;
    await expect(
      new FirebaseHttpService(config).send('token', { kind: 'booking_expired', bookingId: 'b-1' }),
    ).resolves.toBeUndefined();
  });
});
