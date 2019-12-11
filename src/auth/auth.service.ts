import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RequestHandler } from '@nestjs/common/interfaces';
import { CookieOptions, Request } from 'express';
import { auth } from 'firebase-admin';
import { FirebaseService } from '../firebase';
import { CreateSessionResponse } from './auth.interfaces';
import { ConfigService } from '../config';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly configService: ConfigService,
  ) {}

  async createSessionCookie(idToken: string): Promise<CreateSessionResponse> {
    const { firebase } = this.firebaseService;
    const { FirebaseEpireInSession } = this.configService;
    const decodedIdToken = await firebase.auth().verifyIdToken(idToken);

    // Only process if the user just signed in in the last 5 minutes.
    if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
      // TODO: 5 days = 60 * 60 * 24 * 5 * 1000;
      const expiresIn = FirebaseEpireInSession;
      const sessionCookie = await firebase
        .auth()
        .createSessionCookie(idToken, { expiresIn });

      // TODO: should add secure: true
      const sessionOptions: CookieOptions = {
        maxAge: expiresIn,
        httpOnly: true,
      };

      return {
        sessionCookie,
        sessionOptions,
      };
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
   * @param {string} url The URL to check.
   * @param {string} cookie The CSRF token name.
   * @return {function} The middleware function to run.
   */
  attachCsrfToken(url: string, cookie: string): RequestHandler {
    return (req, res, next) => {
      if (req.url == url) {
        res.cookie(cookie, this.makeCsrfToken());
      }
      next && next();
    };
  }

  makeCsrfToken(): string {
    return (Math.random() * 100000000000000000).toString();
  }
}
