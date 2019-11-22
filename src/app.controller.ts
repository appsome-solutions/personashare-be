import {
  Controller,
  Get,
  Post,
  Render,
  MethodNotAllowedException,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AppService } from './app.service';
import { QRCodeResponse } from './app.interfaces';
import { ConfigService } from './config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
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
  async getLoginPage(@Req() req: Request): Promise<{}> {
    const { isDevEnv, FirebaseAPIKey } = this.configService;
    if (isDevEnv) {
      const host = req.header('host');

      return {
        loginSuccessUrl: `http://${host}/login-success`,
        firebaseApiKey: FirebaseAPIKey,
      };
    } else {
      throw new MethodNotAllowedException();
    }
  }

  @Post('/login-success')
  async handleNotify(@Res() res: Response, @Req() req: Request) {
    console.error(req.body);
    res.status(HttpStatus.OK).send();
  }
}
