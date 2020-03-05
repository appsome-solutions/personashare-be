import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserSchema } from './user.schema';
import { FirebaseModule } from '../firebase';
import { AuthModule } from '../auth';
import { SpotModule } from '../spot';
import { PersonaModule } from '../persona';
import { QrCodeModule } from '../qrcode';
import { ConfigModule } from '../config';
import { MailchimpModule } from '../mailchimp';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    FirebaseModule,
    AuthModule,
    SpotModule,
    PersonaModule,
    QrCodeModule,
    ConfigModule,
    MailchimpModule,
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
