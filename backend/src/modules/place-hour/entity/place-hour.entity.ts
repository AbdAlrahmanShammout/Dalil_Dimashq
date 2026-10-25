export type HourSeasonName = 'regular' | 'ramadan';

export class PlaceHourEntity {
  id!: string;
  placeId!: string;
  dayOfWeek!: number;
  opensAt!: number;
  closesAt!: number;
  season: HourSeasonName = 'regular';

  constructor(input: {
    id: string;
    placeId: string;
    dayOfWeek: number;
    opensAt: number;
    closesAt: number;
    season?: HourSeasonName;
  }) {
    Object.assign(this, input);
  }
}
