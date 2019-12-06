import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FirebaseService } from '../firebase';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
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
