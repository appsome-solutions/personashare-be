import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RequestHandler } from '@nestjs/common/interfaces';
import { Request } from 'express';
import { auth } from 'firebase-admin';
import { FirebaseService } from '../firebase';
import { ConfigService } from '../config';
import { SessionService } from '../session';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
  ) {}

  async createSessionCookie(idToken: string): Promise<string> {
    const { firebase } = this.firebaseService;
    const { FirebaseExpireInSession } = this.configService;
    const decodedIdToken = await firebase.auth().verifyIdToken(idToken);

    // Only process if the user just signed in in the last 5 minutes.
    if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
      // TODO: 5 days = 60 * 60 * 24 * 5 * 1000;
      const expiresIn = FirebaseExpireInSession;
      const sid = await firebase
        .auth()
        .createSessionCookie(idToken, { expiresIn });

      const userSession = await this.sessionService.getSession({
        uid: decodedIdToken.uid,
      });

      if (userSession.length) {
        await this.sessionService.updateSession({
          sid,
          uid: decodedIdToken.uid,
        });
      } else {
        await this.sessionService.createSession({
          sid,
          uid: decodedIdToken.uid,
        });
      }

      return sid;
    } else {
      throw new UnauthorizedException('Recent sign in required!');
    }
  }

  async checkSession(req: Request): Promise<auth.DecodedIdToken | null> {
    const sid = req.cookies['ps-session'];

    return sid ? await this.firebaseService.checkSession(sid) : null;
  }

  async checkUser(uid: string): Promise<auth.UserRecord> {
    return await this.firebaseService.getUser(uid);
  }

  /**
   * Attaches a CSRF token to the request.
   * @param {string[]} url The URL to check.
   * @param {string} cookie The CSRF token name.
   * @return {function} The middleware function to run.
   */
  attachCsrfToken(url: string[], cookie: string): RequestHandler {
    return (req, res, next) => {
      if (url.includes(req.url)) {
        res.cookie(cookie, this.makeCsrfToken());
      }
      next && next();
    };
  }

  makeCsrfToken(): string {
    return (Math.random() * 100000000000000000).toString();
  }
}
