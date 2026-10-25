export class OfferEntity {
  id!: string;
  placeId!: string;
  titleAr!: string;
  titleEn!: string;
  detailsAr!: string;
  detailsEn!: string;
  imageKey!: string | null;
  endsAt!: Date;

  constructor(input: {
    id: string;
    placeId: string;
    titleAr: string;
    titleEn: string;
    detailsAr: string;
    detailsEn: string;
    imageKey: string | null;
    endsAt: Date;
  }) {
    Object.assign(this, input);
  }
}
