import { describeBan } from '@/modules/booking/booking-ban';

describe('describeBan', () => {
  it('explains 15 days, 45 days, and a permanent ban', () => {
    const endsAt = new Date('2026-11-09T00:00:00Z');
    expect(describeBan(null).kind).toBe('none');
    expect(describeBan({ level: 1, endsAt }).kind).toBe('15_days');
    expect(describeBan({ level: 2, endsAt }).kind).toBe('45_days');
    expect(describeBan({ level: 3, endsAt: null }).kind).toBe('permanent');
    expect(describeBan({ level: 1, endsAt: null }).kind).toBe('permanent');
  });
});
