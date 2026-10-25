import { Module } from '@nestjs/common';

import { FirebaseHttpService } from '@/providers/firebase/firebase-http.service';
import { FirebaseManagerService } from '@/providers/firebase/firebase-manager.service';

@Module({
  providers: [{ provide: FirebaseManagerService, useClass: FirebaseHttpService }],
  exports: [FirebaseManagerService],
})
export class FirebaseProviderModule {}
