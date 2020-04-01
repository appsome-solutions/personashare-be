import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import dayjs from 'dayjs';
import { FirebaseService } from '../firebase';
import { Guard } from './guard';
import { AuthService } from '../auth';
import { Response, Request } from 'express';

@Injectable()
export class GqlSessionGuard extends Guard implements CanActivate {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly authService: AuthService,
  ) {
    super('GQL');
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = this.getRequest(context);
    const response = this.getResponse(context);

    return this.validateSession(response, request);
  }

  async validateSession(
    response: Response,
    request: Request,
  ): Promise<boolean> {
    const sid = request.cookies['psToken'];
    const lastIdToken = request.cookies['psIdToken'];

    if (!sid) {
      return false;
    }

    try {
      const token = await this.firebaseService.checkSession(sid);

      const now = dayjs();
      const exp = dayjs.unix(token.exp);

      if (now.isBefore(exp)) {
        if (exp.diff(now, 'd', true) < 1) {
          const accessToken = await this.authService.createSessionCookie(
            lastIdToken,
          );

          response.cookie('psToken', accessToken, {
            domain: 'localhost',
            httpOnly: true,
            sameSite: false,
            expires: dayjs()
              .add(1, 'year')
              .toDate(),
          });

          response.cookie('psIdToken', lastIdToken, {
            domain: 'localhost',
            httpOnly: true,
            sameSite: false,
            expires: dayjs()
              .add(1, 'year')
              .toDate(),
          });
        }

        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}
