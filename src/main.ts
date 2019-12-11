import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { AppModule } from './app.module';
import { ConfigService } from './config';
import { AuthService } from './auth';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function bootstrap(): Promise<any> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const authService = app.get(AuthService);

  // This should be set if we are behind proxy, for example nginx reverse proxy
  app.set('trust proxy', true);

  app.use(helmet());
  app.use(cookieParser());
  app.use(authService.attachCsrfToken('/login', 'ps-csrfToken'));
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  app.enableShutdownHooks();

  await app.listen(configService.port);
}
bootstrap();
