import {
  Controller,
  Get,
  Post,
  Render,
  MethodNotAllowedException,
  Body,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { QRCodeResponse } from './app.interfaces';
import { ConfigService } from './config';
import { QrCodeService } from './qrcode';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly qrCodeService: QrCodeService,
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

  @Get('/qr')
  @Render('qrCodeCreate')
  async createQrCode(@Body() payload: any): Promise<any> {
    if (this.configService.isDevEnv) {
      console.log(payload);
      return {};
    } else {
      throw new MethodNotAllowedException();
    }
  }

  @Post('/qr')
  async handleQrCodePayload(
    @Body() payload: any,
    @Res() response: Response,
  ): Promise<any> {
    if (this.configService.isDevEnv) {
      if (payload.link) {
        const code = await this.qrCodeService.createQRCodeWithLogo(
          payload.link,
        );
        response.set('Content-Type', 'application/octet-stream');
        response.set('Content-Disposition', 'inline;filename=qrCode.svg');
        response.send(code);
      } else {
        return { error: 'Missing link' };
      }
    } else {
      throw new MethodNotAllowedException();
    }
  }
}
