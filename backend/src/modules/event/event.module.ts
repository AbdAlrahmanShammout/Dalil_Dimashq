import { Module } from '@nestjs/common';

import { EventService } from '@/modules/event/event.service';
import { EventPrismaRepository } from '@/modules/event/repository/event-prisma.repository';
import { EventRepository } from '@/modules/event/repository/event.repository';
import { PhotoStorage } from '@/modules/place-photo/photo-storage';
import { AwsS3ManagerService } from '@/providers/aws-s3/aws-s3-manager.service';
import { AwsS3ProviderModule } from '@/providers/aws-s3/aws-s3-provider.module';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule, AwsS3ProviderModule],
  providers: [
    EventService,
    { provide: EventRepository, useClass: EventPrismaRepository },
    { provide: PhotoStorage, useExisting: AwsS3ManagerService },
  ],
  exports: [EventService],
})
export class EventModule {}
