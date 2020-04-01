import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase';
import { ConfigService } from '../config';
import { GQLContext } from '../app.interfaces';
import dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly configService: ConfigService,
  ) {}

  async createSessionCookie(idToken: string): Promise<string> {
    const { firebase } = this.firebaseService;
    const { FirebaseExpireInSession } = this.configService;
    const decodedIdToken = await firebase.auth().verifyIdToken(idToken);

    // Only process if the user just signed in in the last 5 minutes.
    if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
      const expiresIn = FirebaseExpireInSession;

      return await firebase.auth().createSessionCookie(idToken, { expiresIn });
    } else {
      throw new UnauthorizedException('Recent sign in required!');
    }
  }

  setCookieInGQLContext(
    context: GQLContext,
    token: string,
    idToken: string,
  ): void {
    context.res.cookie('psToken', token, {
      domain: 'localhost',
      httpOnly: true,
      sameSite: false,
      expires: dayjs()
        .add(1, 'year')
        .toDate(),
    });

    context.res.cookie('psIdToken', idToken, {
      domain: 'localhost',
      httpOnly: true,
      sameSite: false,
      expires: dayjs()
        .add(1, 'year')
        .toDate(),
    });
  }
}
