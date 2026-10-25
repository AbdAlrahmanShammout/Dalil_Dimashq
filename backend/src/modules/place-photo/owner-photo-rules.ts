import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';

export const OWNER_PHOTO_MAX_BYTES = 2 * 1024 * 1024;
export const OWNER_PHOTO_MAX_COUNT = 30;
export const OWNER_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export interface PreparedOwnerPhoto {
  readonly key: string;
}

/**
 * Accepts jpeg, png, or webp up to 2 MB, with at most 30 photos, and builds `{placeId}/{file}`.
 * A refusal happens before any storage call.
 */
export function prepareOwnerPhoto(input: {
  readonly placeId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly byteLength: number;
  readonly existingCount: number;
}): PreparedOwnerPhoto {
  if (!OWNER_PHOTO_TYPES.includes(input.mimeType as (typeof OWNER_PHOTO_TYPES)[number])) {
    throw new InvalidStateException({ message: 'Photo type is invalid', code: 'photo_invalid' });
  }
  if (input.byteLength <= 0 || input.byteLength > OWNER_PHOTO_MAX_BYTES) {
    throw new InvalidStateException({ message: 'Photo is too large', code: 'photo_too_large' });
  }
  if (input.existingCount >= OWNER_PHOTO_MAX_COUNT) {
    throw new InvalidStateException({ message: 'Photo limit reached', code: 'photo_limit' });
  }
  const fileName = sanitizePhotoFileName(input.fileName);
  if (!fileName) {
    throw new InvalidStateException({ message: 'Photo type is invalid', code: 'photo_invalid' });
  }
  return { key: `${input.placeId}/${fileName}` };
}

function sanitizePhotoFileName(fileName: string): string | null {
  const baseName = fileName.split(/[/\\]/).pop() ?? '';
  const cleaned = baseName.replace(/[^A-Za-z0-9._-]/g, '').replace(/^\.+/, '');
  if (!cleaned || cleaned === '.' || cleaned === '..') {
    return null;
  }
  return cleaned;
}
