import { Module } from '@nestjs/common';
import { QrCodeService } from './qr-code.service';
import { ConfigModule } from '../config';
import { FirebaseModule } from '../firebase';

@Module({
  imports: [ConfigModule, FirebaseModule],
  providers: [QrCodeService],
  exports: [QrCodeService],
})
export class QrCodeModule {}
