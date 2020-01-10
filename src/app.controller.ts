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
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import {
  GetLoginPageResponse,
  GetProfilePageResponse,
  QRCodeResponse,
} from './app.interfaces';
import { ConfigService } from './config';
import { AuthService, CSRF_TOKEN_NAME } from './auth';
import { UserService } from './user';
import { FirebaseService } from './firebase';
import { SessionGuard } from './guards';

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
  @UseGuards(SessionGuard)
  @Render('profile')
  async getProfilePage(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<GetProfilePageResponse | void> {
    const userData = await this.authService.checkSession(req);
    const host = req.header('host');

    if (userData && userData.uid) {
      const user = await this.userService.getUser({ uuid: userData.uid });

      if (user) {
        return user;
      } else {
        throw new NotFoundException('User cant be found');
      }
    } else {
      return res.redirect(301, `http://${host}/login`);
    }
  }

  // TODO: This will be replaced by using GraphQL mutation with credentials
  @Post('/login-success')
  async handleNotify(@Res() res: Response, @Req() req: Request): Promise<void> {
    const { idToken, csrfToken } = req.body;

    if (csrfToken !== req.cookies[CSRF_TOKEN_NAME]) {
      throw new UnauthorizedException('UNAUTHORIZED REQUEST!');
    }

    try {
      const sid = await this.authService.createSessionCookie(idToken);
      const userData = await this.firebaseService.checkSession(sid);
      const { uid, email, name, picture } = userData;
      const user = await this.userService.getUser({ uuid: uid });

      if (user) {
        await this.userService.createUser({
          uuid: uid,
          email,
          name,
          photo: picture,
        });
      }

      res.end(JSON.stringify({ accessToken: sid }));
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
