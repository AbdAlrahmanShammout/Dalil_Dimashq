export interface UploadObjectInput {
  readonly key: string;
  readonly body: Uint8Array;
  readonly contentType: string;
}

export interface UploadObjectResult {
  readonly key: string;
  readonly readUrl: string;
}
