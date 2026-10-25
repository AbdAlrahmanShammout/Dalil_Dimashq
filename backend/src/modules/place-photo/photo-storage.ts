export abstract class PhotoStorage {
  abstract createReadUrl(key: string): Promise<string>;
}
