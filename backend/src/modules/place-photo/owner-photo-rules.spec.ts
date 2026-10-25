import { OWNER_PHOTO_MAX_BYTES, prepareOwnerPhoto } from '@/modules/place-photo/owner-photo-rules';

describe('prepareOwnerPhoto', () => {
  const input = {
    placeId: 'place-1',
    fileName: 'folder/front.jpg',
    mimeType: 'image/jpeg',
    byteLength: 12,
    existingCount: 0,
  };

  it('builds the object key and refuses a bad file before storage', () => {
    expect(prepareOwnerPhoto(input).key).toBe('place-1/front.jpg');
    expect(() => prepareOwnerPhoto({ ...input, mimeType: 'image/gif' })).toThrow(
      expect.objectContaining({ code: 'photo_invalid' }),
    );
    expect(() => prepareOwnerPhoto({ ...input, byteLength: OWNER_PHOTO_MAX_BYTES + 1 })).toThrow(
      expect.objectContaining({ code: 'photo_too_large' }),
    );
    expect(() => prepareOwnerPhoto({ ...input, existingCount: 30 })).toThrow(
      expect.objectContaining({ code: 'photo_limit' }),
    );
  });
});
