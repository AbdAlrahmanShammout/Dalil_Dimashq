export class PlaceAmenityEntity {
  code!: string;
  nameAr!: string;
  nameEn!: string;
  sortOrder!: number;
  approved!: boolean;

  constructor(input: {
    code: string;
    nameAr: string;
    nameEn: string;
    sortOrder: number;
    approved: boolean;
  }) {
    Object.assign(this, input);
  }
}
