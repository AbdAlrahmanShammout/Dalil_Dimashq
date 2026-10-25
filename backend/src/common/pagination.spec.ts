import { nextPageOffset } from '@/common/pagination';

describe('nextPageOffset', () => {
  it('advances while another page remains', () => {
    expect(nextPageOffset(0, 20, 21)).toBe(20);
    expect(nextPageOffset(20, 20, 21)).toBeNull();
  });
});
