import { Injectable } from '@nestjs/common';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { PlaceGeocodeService } from '@/modules/place/place-geocode.service';
import { PlaceRepository, StaffPlaceWrite } from '@/modules/place/repository/place.repository';

@Injectable()
export class StaffPlaceService {
  constructor(
    private readonly placeRepository: PlaceRepository,
    private readonly placeGeocodeService: PlaceGeocodeService,
  ) {}

  /**
   * Writes a directory place, then geocodes the address when one is present.
   */
  async create(input: StaffPlaceWrite): Promise<{ id: string }> {
    const created = await this.placeRepository.createStaffPlace(input);
    await this.geocode(created.id, input);
    return created;
  }

  /**
   * Updates directory fields and geocodes the address again.
   */
  async update(id: string, input: StaffPlaceWrite): Promise<void> {
    const updated = await this.placeRepository.updateStaffPlace(id, input);
    if (!updated) {
      throw new ResourceNotFoundException('Place', id);
    }
    await this.geocode(id, input);
  }

  private async geocode(placeId: string, input: StaffPlaceWrite): Promise<void> {
    const address = input.addressEn ?? input.addressAr;
    if (!address) {
      return;
    }
    await this.placeGeocodeService.saveAddress({ placeId, address });
  }
}
