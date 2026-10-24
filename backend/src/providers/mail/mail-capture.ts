export interface CapturedMailMessage {
  readonly to: string;
  readonly subject: string;
  readonly text: string;
}

export const capturedMail: CapturedMailMessage[] = [];

export function clearCapturedMail(): void {
  capturedMail.length = 0;
}
