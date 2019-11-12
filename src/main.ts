import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigService } from './config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // This should be set if we are behind proxy, for example nginx reverse proxy
  app.set('trust proxy', true);

  app.use(helmet());
  app.enableCors();

  await app.listen(configService.port);
}
bootstrap();
