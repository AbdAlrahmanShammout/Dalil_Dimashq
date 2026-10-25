export enum PlacePhotoRole {
  Gallery = 'gallery',
  Cover = 'cover',
  Logo = 'logo',
}

export class PlacePhotoEntity {
  id!: string;
  objectKey!: string;
  role!: PlacePhotoRole;
  hidden!: boolean;
  sortOrder!: number;

  constructor(input: {
    id: string;
    objectKey: string;
    role: PlacePhotoRole;
    hidden: boolean;
    sortOrder: number;
  }) {
    Object.assign(this, input);
  }
}
