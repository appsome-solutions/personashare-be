import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseModule } from '../firebase';
import { ConfigModule } from '../config';
import { SessionModule } from '../session';

@Module({
  imports: [FirebaseModule, ConfigModule, SessionModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
