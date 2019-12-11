import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { FirebaseService } from '../firebase';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
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
