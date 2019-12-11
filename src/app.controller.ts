import {
  Controller,
  Get,
  Post,
  Render,
  MethodNotAllowedException,
  Req,
  UnauthorizedException,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import {
  GetLoginPageResponse,
  GetProfilePageResponse,
  QRCodeResponse,
} from './app.interfaces';
import { ConfigService } from './config';
import { AuthService, AuthGuard } from './auth';
import { UserService } from './user';
import { FirebaseService } from './firebase';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Get('/app')
  @Render('appQrCode')
  async getApplicationQrCode(): Promise<QRCodeResponse> {
    if (this.configService.isDevEnv) {
      const qrCode = await this.appService.getApplicationQrCode();
      return { qrCode };
    } else {
      throw new MethodNotAllowedException();
    }
  }

  @Get('/login')
  @Render('login')
  async getLoginPage(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<GetLoginPageResponse | void> {
    const {
      isDevEnv,
      FirebaseAPIKey,
      FirebaseAppId,
      FirebaseAuthDomain,
      FirebaseDbUrl,
      FirebaseMessagingSenderId,
      FirebaseProjectId,
      FirebaseStorageBucket,
    } = this.configService;
    if (isDevEnv) {
      const host = req.header('host');
      const decodedIdToken = await this.authService.checkSession(req);

      if (!decodedIdToken) {
        return {
          loginSuccessUrl: `http://${host}/login-success`,
          postLoginSuccessUrl: `http://${host}/profile`,
          apiKey: FirebaseAPIKey,
          appId: FirebaseAppId,
          authDomain: FirebaseAuthDomain,
          databaseURL: FirebaseDbUrl,
          messagingSenderId: FirebaseMessagingSenderId,
          projectId: FirebaseProjectId,
          storageBucket: FirebaseStorageBucket,
        };
      } else {
        return res.redirect(301, `http://${host}/profile`);
      }
    } else {
      throw new MethodNotAllowedException();
    }
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  @Render('profile')
  async getProfilePage(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<GetProfilePageResponse | void> {
    const decodedIdToken = await this.authService.checkSession(req);
    const host = req.header('host');

    if (decodedIdToken) {
      return {
        email: decodedIdToken.email,
        emailVerified: decodedIdToken.email_verified,
        name: decodedIdToken.name,
        picture: decodedIdToken.picture,
      };
    } else {
      return res.redirect(301, `http://${host}/login`);
    }
  }

  // TODO: This will be replaced by using GraphQL mutation with credentials
  @Post('/login-success')
  async handleNotify(@Res() res: Response, @Req() req: Request): Promise<void> {
    const { idToken, csrfToken } = req.body;

    if (csrfToken !== req.cookies['ps-csrfToken']) {
      throw new UnauthorizedException('UNAUTHORIZED REQUEST!');
    }

    try {
      const {
        sessionCookie,
        sessionOptions,
      } = await this.authService.createSessionCookie(idToken);
      const userData = await this.firebaseService.checkSession(sessionCookie);
      const { uid, email, name, picture } = userData;
      const user = await this.userService.findByMatch({ uuid: uid });

      if (user.length < 1) {
        await this.userService.createUser({
          uuid: uid,
          email,
          name,
          photo: picture,
        });
      }

      res.cookie('ps-session', sessionCookie, sessionOptions);
      res.end(JSON.stringify({ status: 'success' }));
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
