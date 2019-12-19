import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FirebaseService } from '../firebase';
import { Guard } from './guard';

@Injectable()
export class SessionGuard extends Guard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {
    super('REST');
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = this.getRequest(context);
    const authHeader = request.header('Authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : '';

    return this.validateSession(token);
  }

  async validateSession(sid?: string): Promise<boolean> {
    if (!sid) {
      return false;
    }

    return this.firebaseService
      .checkSession(sid)
      .then(token => !!token)
      .catch(() => false);
  }
}
