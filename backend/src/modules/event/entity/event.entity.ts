import { PlaceEntity } from '@/modules/place/entity/place.entity';

export class EventEntity {
  id!: string;
  placeId!: string | null;
  titleAr!: string;
  titleEn!: string;
  descriptionAr!: string;
  descriptionEn!: string;
  addressAr!: string | null;
  addressEn!: string | null;
  phone!: string | null;
  posterKey!: string | null;
  startsAt!: Date;
  place?: PlaceEntity | null;

  constructor(input: {
    id: string;
    placeId: string | null;
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
    addressAr: string | null;
    addressEn: string | null;
    phone: string | null;
    posterKey: string | null;
    startsAt: Date;
  }) {
    Object.assign(this, input);
  }
}
