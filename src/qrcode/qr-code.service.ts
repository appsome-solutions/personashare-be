import { Injectable } from '@nestjs/common';
import { toDataURL, QRCodeToDataURLOptions } from 'qrcode';
import { QrCodeStyle } from './qr-code.interfaces';

@Injectable()
export class QrCodeService {
  public async createQrCode(
    content: string,
    style?: QrCodeStyle,
  ): Promise<string> {
    const qrCodeStyles = Object.assign(
      {
        margin: 4,
        color: {
          dark: '#000',
          light: '#FFF',
        },
      },
      style,
    );

    const opts: QRCodeToDataURLOptions = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      ...qrCodeStyles,
    };

    return await toDataURL(content, opts);
  }
}
