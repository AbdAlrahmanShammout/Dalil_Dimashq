import { Injectable, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class SchedulerManagerService implements OnModuleDestroy {
  private readonly jobs = new Map<string, NodeJS.Timeout>();

  /**
   * Registers a named interval. Domains pass a callback and never touch the timer API.
   */
  register(name: string, intervalMs: number, handle: () => Promise<void>): void {
    if (this.jobs.has(name)) {
      return;
    }
    const timer = setInterval(() => {
      void handle();
    }, intervalMs);
    this.jobs.set(name, timer);
  }

  has(name: string): boolean {
    return this.jobs.has(name);
  }

  onModuleDestroy(): void {
    for (const timer of this.jobs.values()) {
      clearInterval(timer);
    }
    this.jobs.clear();
  }
}
