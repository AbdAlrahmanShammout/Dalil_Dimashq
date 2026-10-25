export interface PushMessage {
  readonly kind: string;
  readonly bookingId: string | null;
}

export abstract class FirebaseManagerService {
  abstract send(token: string, message: PushMessage): Promise<void>;
}
