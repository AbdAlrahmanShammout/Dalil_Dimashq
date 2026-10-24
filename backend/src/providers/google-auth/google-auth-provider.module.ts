import { Module } from '@nestjs/common';

import { GoogleAuthManagerService } from '@/providers/google-auth/google-auth-manager.service';

@Module({
  providers: [GoogleAuthManagerService],
  exports: [GoogleAuthManagerService],
})
export class GoogleAuthProviderModule {}
