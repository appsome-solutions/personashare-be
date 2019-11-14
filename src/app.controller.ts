import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { QRCodeResponse } from './app.interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/app')
  @Render('appQrCode')
  async getApplicationQrCode(): Promise<QRCodeResponse> {
    const qrCode = await this.appService.getApplicationQrCode();
    return { qrCode };
  }
}
