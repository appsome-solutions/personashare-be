import { Injectable } from '@nestjs/common';
import { toDataURL, QRCodeToDataURLOptions } from 'qrcode';
import { QrCodeStyle } from './qr-code.interfaces';

const defaultQrCodeStyle: QrCodeStyle = {
  margin: 4,
  color: {
    dark: '#000',
    light: '#FFF',
  },
};

@Injectable()
export class QrCodeService {
  async createQrCode(content: string, style?: QrCodeStyle): Promise<string> {
    const qrCodeStyles = {
      defaultQrCodeStyle,
      style,
    };

    const opts: QRCodeToDataURLOptions = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      ...qrCodeStyles,
    };

    return await toDataURL(content, opts);
  }
}
