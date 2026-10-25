import { Injectable } from '@nestjs/common';

import { PlacePhotoEntity, PlacePhotoRole } from '@/modules/place-photo/entity/place-photo.entity';
import { PlacePhotoRepository } from '@/modules/place-photo/repository/place-photo.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class PlacePhotoPrismaRepository extends PlacePhotoRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async listVisible(placeId: string): Promise<PlacePhotoEntity[]> {
    const rows = await this.prisma.placePhoto.findMany({
      where: { placeId, hidden: false },
      orderBy: { sortOrder: 'asc' },
    });
    return rows.map(
      (row) =>
        new PlacePhotoEntity({
          id: row.id,
          objectKey: row.objectKey,
          role: row.role as PlacePhotoRole,
          hidden: row.hidden,
          sortOrder: row.sortOrder,
        }),
    );
  }

  override async countByPlace(placeId: string): Promise<number> {
    return this.prisma.placePhoto.count({ where: { placeId } });
  }

  override async create(input: {
    placeId: string;
    objectKey: string;
  }): Promise<{ id: string; objectKey: string }> {
    const row = await this.prisma.placePhoto.create({
      data: { placeId: input.placeId, objectKey: input.objectKey, role: 'gallery' },
    });
    return { id: row.id, objectKey: row.objectKey };
  }

  override async assignRole(
    placeId: string,
    photoId: string,
    role: 'cover' | 'logo',
  ): Promise<boolean> {
    const photo = await this.prisma.placePhoto.findFirst({ where: { id: photoId, placeId } });
    if (!photo) {
      return false;
    }
    await this.prisma.$transaction([
      this.prisma.placePhoto.updateMany({ where: { placeId, role }, data: { role: 'gallery' } }),
      this.prisma.placePhoto.update({ where: { id: photoId }, data: { role } }),
    ]);
    return true;
  }

  override async deleteOwned(
    placeId: string,
    photoId: string,
  ): Promise<{ objectKey: string } | null> {
    const photo = await this.prisma.placePhoto.findFirst({ where: { id: photoId, placeId } });
    if (!photo) {
      return null;
    }
    await this.prisma.placePhoto.delete({ where: { id: photo.id } });
    return { objectKey: photo.objectKey };
  }
}
