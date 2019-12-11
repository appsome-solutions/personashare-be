import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseModule } from '../firebase';
import { ConfigModule } from '../config';

@Module({
  imports: [FirebaseModule, ConfigModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
