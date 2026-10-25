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

  /**
   * Returns the current DD- claim code.
   */
  async readCode(id: string): Promise<string> {
    const code = await this.placeRepository.readClaimCode(id);
    if (!code) {
      throw new ResourceNotFoundException('Place', id);
    }
    return code;
  }

  /**
   * Rotates the claim code. The previous code stops matching.
   */
  async renewCode(id: string): Promise<string> {
    const code = await this.placeRepository.renewClaimCode(id);
    if (!code) {
      throw new ResourceNotFoundException('Place', id);
    }
    return code;
  }

  /**
   * Marks or clears the featured flag. Hidden places can still carry the flag.
   */
  async setFeatured(id: string, featured: boolean): Promise<void> {
    const updated = await this.placeRepository.setFeatured(id, featured);
    if (!updated) {
      throw new ResourceNotFoundException('Place', id);
    }
  }

  private async geocode(placeId: string, input: StaffPlaceWrite): Promise<void> {
    const address = input.addressEn ?? input.addressAr;
    if (!address) {
      return;
    }
    await this.placeGeocodeService.saveAddress({ placeId, address });
  }
}
