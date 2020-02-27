import {
  Controller,
  Get,
  Render,
  MethodNotAllowedException,
} from '@nestjs/common';
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
}
