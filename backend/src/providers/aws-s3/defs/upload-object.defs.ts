export interface UploadObjectInput {
  readonly key: string;
  readonly body: Buffer;
  readonly contentType: string;
}

export interface UploadObjectResult {
  readonly key: string;
  readonly readUrl: string;
}
