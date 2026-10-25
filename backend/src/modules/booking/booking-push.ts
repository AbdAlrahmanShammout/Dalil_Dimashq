import { Injectable } from '@nestjs/common';

import { DeviceRepository } from '@/modules/device/repository/device.repository';
import { FirebaseManagerService } from '@/providers/firebase/firebase-manager.service';

export interface BookingPushNotice {
  readonly userId: string;
  readonly bookingId: string;
}

export abstract class BookingPushNotifier {
  abstract notify(rows: readonly BookingPushNotice[]): Promise<void>;
}

@Injectable()
export class FirebaseBookingPushNotifier extends BookingPushNotifier {
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly firebaseManagerService: FirebaseManagerService,
  ) {
    super();
  }

  /**
   * A visitor with no device token is skipped. The in-app row is already stored.
   */
  async notify(rows: readonly BookingPushNotice[]): Promise<void> {
    for (const row of rows) {
      const tokens = await this.deviceRepository.listTokens(row.userId);
      for (const token of tokens) {
        await this.firebaseManagerService.send(token, {
          kind: 'booking_expired',
          bookingId: row.bookingId,
        });
      }
    }
  }
}
