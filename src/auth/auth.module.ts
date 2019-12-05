import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseModule } from '../firebase';

@Module({
  imports: [FirebaseModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
