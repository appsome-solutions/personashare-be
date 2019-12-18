import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FirebaseService } from '../firebase';
import { Guard } from './guard';
import { SessionService } from '../session';

@Injectable()
export class GqlSessionGuard extends Guard implements CanActivate {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly sessionService: SessionService,
  ) {
    super('GQL');
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

    const session = await this.sessionService.getSession({ sid });

    if (session.length < 1) {
      return false;
    }

    return this.firebaseService
      .checkSession(sid)
      .then(token => !!token)
      .catch(async () => {
        await this.sessionService.deleteSession({ sid });
        return false;
      });
  }
}
