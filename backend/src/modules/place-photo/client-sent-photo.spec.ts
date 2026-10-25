import { receiveClientPhoto } from '@/modules/place-photo/client-sent-photo';

describe('receiveClientPhoto', () => {
  it('accepts bytes the client already chose and does not store them', () => {
    const bytes = Uint8Array.from([1, 2, 3, 4]);
    const receipt = receiveClientPhoto({ fileName: 'front.jpg', bytes });
    expect(receipt).toEqual({ received: true, fileName: 'front.jpg', byteLength: 4 });
    expect(bytes.byteLength).toBe(4);
  });
});
