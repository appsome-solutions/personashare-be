import { Injectable } from '@nestjs/common';
import { Example } from './dto/example.dto';
import { QrCodeService } from '../qrcode';

@Injectable()
export class ExampleService {
  public constructor(private readonly qrCodeService: QrCodeService) {}

  public async getExample(id: string): Promise<Example> {
    const qrCodeDataUri = await this.qrCodeService.createQrCode(id);

    return {
      qrCodeDataUri,
    };
  }
}
