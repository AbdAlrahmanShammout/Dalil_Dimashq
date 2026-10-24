export class PlaceHourEntity {
  id!: string;
  placeId!: string;
  dayOfWeek!: number;
  opensAt!: number;
  closesAt!: number;

  constructor(input: {
    id: string;
    placeId: string;
    dayOfWeek: number;
    opensAt: number;
    closesAt: number;
  }) {
    Object.assign(this, input);
  }
}
