import { SchedulerManagerService } from '@/providers/scheduler/scheduler-manager.service';

describe('SchedulerManagerService', () => {
  it('registers a named job once', () => {
    jest.useFakeTimers();
    const service = new SchedulerManagerService();
    const handle = jest.fn().mockResolvedValue(undefined);
    service.register('booking-clock', 1000, handle);
    service.register('booking-clock', 1000, handle);
    jest.advanceTimersByTime(1000);
    expect(handle).toHaveBeenCalledTimes(1);
    expect(service.has('booking-clock')).toBe(true);
    service.onModuleDestroy();
    jest.useRealTimers();
  });
});
