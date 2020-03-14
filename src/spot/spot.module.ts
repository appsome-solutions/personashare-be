import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpotService } from './spot.service';
import { SpotResolver } from './spot.resolver';
import { SpotSchema } from './spot.schema';
import { FirebaseModule } from '../firebase';
import { UserModule } from '../user';
import { QrCodeModule } from '../qrcode';
import { ConfigModule } from '../config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Spot', schema: SpotSchema }]),
    FirebaseModule,
    QrCodeModule,
    ConfigModule,
    UserModule,
  ],
  providers: [SpotService, SpotResolver],
  exports: [SpotService],
})
export class SpotModule {}
