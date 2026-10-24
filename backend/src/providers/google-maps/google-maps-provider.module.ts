import { Module } from '@nestjs/common';

import { GoogleMapsManagerService } from '@/providers/google-maps/google-maps-manager.service';

@Module({
  providers: [GoogleMapsManagerService],
  exports: [GoogleMapsManagerService],
})
export class GoogleMapsProviderModule {}
