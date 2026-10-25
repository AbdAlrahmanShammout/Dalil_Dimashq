import { Injectable } from '@nestjs/common';

import { AreaResponseDto } from '@/modules/area/dto/response/area-response.dto';
import { PlaceType } from '@/modules/place/enum/general.enum';
import { DirectoryPlace, PlaceRepository } from '@/modules/place/repository/place.repository';
import { PhotoStorage } from '@/modules/place-photo/photo-storage';

export interface DirectoryItem {
  readonly id: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly type: PlaceType;
  readonly area: AreaResponseDto;
  readonly coverUrl: string | null;
}

@Injectable()
export class DirectoryService {
  constructor(
    private readonly placeRepository: PlaceRepository,
    private readonly photoStorage: PhotoStorage,
  ) {}

  /**
   * JSON rows the website renders itself. No HTML.
   */
  async listDirectory(): Promise<DirectoryItem[]> {
    const rows = await this.placeRepository.listDirectory();
    return Promise.all(rows.map((row) => this.toItem(row)));
  }

  private async toItem(row: DirectoryPlace): Promise<DirectoryItem> {
    const coverUrl = row.coverKey ? await this.photoStorage.createReadUrl(row.coverKey) : null;
    return {
      id: row.id,
      nameAr: row.nameAr,
      nameEn: row.nameEn,
      type: row.type,
      area: new AreaResponseDto(row.area),
      coverUrl,
    };
  }
}
