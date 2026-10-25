import { ActiveBan } from '@/modules/booking/repository/booking-ban.repository';

export type BanKind = 'none' | '15_days' | '45_days' | 'permanent';

export interface BanExplanation {
  readonly active: boolean;
  readonly kind: BanKind;
  readonly level: number | null;
  readonly endsAt: Date | null;
}

const FIRST_BAN_LEVEL = 1;
const SECOND_BAN_LEVEL = 2;

/**
 * Level 1 lasts 15 days, level 2 lasts 45 days, and level 3 or a missing end is permanent.
 */
export function describeBan(ban: ActiveBan | null): BanExplanation {
  if (!ban) {
    return { active: false, kind: 'none', level: null, endsAt: null };
  }
  if (ban.level > SECOND_BAN_LEVEL || ban.endsAt === null) {
    return { active: true, kind: 'permanent', level: ban.level, endsAt: null };
  }
  const kind = ban.level === FIRST_BAN_LEVEL ? '15_days' : '45_days';
  return { active: true, kind, level: ban.level, endsAt: ban.endsAt };
}
