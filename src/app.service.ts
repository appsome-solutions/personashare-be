import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { INgrokOptions } from 'ngrok';
import { QrCodeService } from './qrcode';
import { ConfigService } from './config';
import { NgrokService } from './ngrok';

@Injectable()
export class AppService implements OnApplicationShutdown {
  private ngRokUrl: string;

  constructor(
    private readonly qrCodeService: QrCodeService,
    private readonly configService: ConfigService,
    private readonly ngrokService: NgrokService,
  ) {}

  private async initNgRokTunnel(): Promise<string> {
    const ngRokOptions: INgrokOptions = {
      addr: this.configService.applicationPort,
    };
    return await this.ngrokService.connect(ngRokOptions);
  }

  async getApplicationQrCode(): Promise<string> {
    if (!this.ngRokUrl) {
      this.ngRokUrl = await this.initNgRokTunnel();
    }

    return await this.qrCodeService.createQrCode(this.ngRokUrl);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
  onApplicationShutdown(_signal?: string): any {
    this.ngrokService.disconnect();
  }
}
