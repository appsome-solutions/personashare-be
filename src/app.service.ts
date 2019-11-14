import { Injectable } from '@nestjs/common';
import { QrCodeService } from './qrcode';
import { ConfigService } from './config';

@Injectable()
export class AppService {
  constructor(
    private readonly qrCodeService: QrCodeService,
    private readonly configService: ConfigService,
  ) {}

  async getApplicationQrCode(): Promise<string> {
    return await this.qrCodeService.createQrCode(
      this.configService.ApplicationUrl,
    );
  }
}
