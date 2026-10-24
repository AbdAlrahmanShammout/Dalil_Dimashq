import { Module } from '@nestjs/common';

import { AuthClientAppController } from '@/authentication/auth.client-app.controller';
import { AuthModule } from '@/authentication/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AuthClientAppController],
})
export class ClientAppApiModule {}
