import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FirebaseService } from '../firebase';
import { Guard } from './guard';

@Injectable()
export class GqlSessionGuard extends Guard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {
    super('GQL');
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = this.getRequest(context);
    const sid = request.cookies['ps-session'];

    return this.validateSession(sid);
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
