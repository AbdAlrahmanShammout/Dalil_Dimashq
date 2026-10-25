export abstract class PhotoStorage {
  abstract createReadUrl(key: string): Promise<string>;

  uploadObject(_input: {
    readonly key: string;
    readonly body: Uint8Array;
    readonly contentType: string;
  }): Promise<void> {
    return Promise.reject(new Error('uploadObject is not implemented'));
  }

  deleteObject(_key: string): Promise<void> {
    return Promise.reject(new Error('deleteObject is not implemented'));
  }
}
