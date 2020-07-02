import { Injectable } from '@nestjs/common';
import { toDataURL, QRCodeToDataURLOptions, toString } from 'qrcode';
import { createCanvas, loadImage } from 'canvas';
import path from 'path';

import { QrCodeStyle } from './qr-code.interfaces';
import { ConfigService } from '../config';
import { FirebaseService } from '../firebase';

const defaultQrCodeStyle: QrCodeStyle = {
  margin: 4,
  color: {
    dark: '#000',
    light: '#FFF',
  },
};

@Injectable()
export class QrCodeService {
  constructor(
    private readonly configService: ConfigService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async createQrCode(content: string, style?: QrCodeStyle): Promise<string> {
    const qrCodeStyles = {
      ...defaultQrCodeStyle,
      ...style,
    };

    const opts: QRCodeToDataURLOptions = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      ...qrCodeStyles,
    };

    return await toDataURL(content, opts);
  }

  async createQRCodeWithLogo(content: string, size = 256): Promise<string> {
    const logoImg = await loadImage(path.resolve(__dirname, 'qrLogoNew.svg'));
    const innerImgSquareSize = Math.floor(2 * size);

    const canvas = createCanvas(innerImgSquareSize, innerImgSquareSize);
    const canvasCtx = canvas.getContext('2d');

    canvasCtx.drawImage(logoImg, 0, 0, innerImgSquareSize, innerImgSquareSize);

    const data = canvasCtx.canvas.toDataURL('image/svg+xml');

    const svg = await toString(content, { type: 'svg', width: size });

    const imgToPut = `<image id="logo" xlink:href="${data}" height="14px" width="14px" x="50%" y="50%" transform="translate(-7,-7)"/></svg>`;

    return svg
      .replace('</svg>', imgToPut)
      .replace(
        'xmlns="http://www.w3.org/2000/svg"',
        'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"',
      );
  }

  async uploadQrCodeWithLogo(
    assetPath: string,
    content: string,
    size = 256,
    contentType?: string,
  ): Promise<string> {
    const svg = await this.createQRCodeWithLogo(content, size);

    const { FirebaseStorageBucket } = this.configService;
    const file = await this.firebaseService.firebase
      .storage()
      .bucket(FirebaseStorageBucket)
      .file(assetPath);

    await file.save(svg, {
      predefinedAcl: 'publicRead',
      contentType: contentType || 'image/svg+xml',
      private: false,
      public: true,
      validation: false,
      resumable: false,
    });

    await file.makePublic();

    return file.metadata.mediaLink;
  }
}
