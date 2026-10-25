export interface ClientSentPhoto {
  readonly fileName: string;
  readonly bytes: Uint8Array;
}

export interface ClientPhotoReceipt {
  readonly received: true;
  readonly fileName: string;
  readonly byteLength: number;
}

/**
 * Accepts a file the phone already chose from the camera or the gallery.
 * This API does not open a picker and does not store the bytes.
 */
export function receiveClientPhoto(photo: ClientSentPhoto): ClientPhotoReceipt {
  return {
    received: true,
    fileName: photo.fileName,
    byteLength: photo.bytes.byteLength,
  };
}
