import { Module } from '@nestjs/common';

import { JwtManagerService } from '@/providers/jwt/jwt-manager.service';

@Module({
  providers: [JwtManagerService],
  exports: [JwtManagerService],
})
export class JwtProviderModule {}
