import { Injectable } from '@nestjs/common';

import {
  BookingRepository,
  OwnerBookingRow,
} from '@/modules/booking/repository/booking.repository';

@Injectable()
export class OwnerBookingService {
  constructor(private readonly bookingRepository: BookingRepository) {}

  /**
   * Bookings for a linked place, with the visitor name, phone, and report flag.
   */
  async listForPlace(placeId: string): Promise<OwnerBookingRow[]> {
    return this.bookingRepository.listForPlace(placeId);
  }
}
