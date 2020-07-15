import { NestFactory } from '@nestjs/core';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginExpress from '@bugsnag/plugin-express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { join } from 'path';
import { AppModule } from './app.module';
import { ConfigService } from './config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function bootstrap(): Promise<any> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const { bugsnagApiKey } = configService;

  if (bugsnagApiKey) {
    Bugsnag.start({
      apiKey: bugsnagApiKey,
      plugins: [BugsnagPluginExpress],
    });
  }

  const middleware = bugsnagApiKey ? Bugsnag.getPlugin('express') : null;

  const allowedOrigins = configService.isDevEnv
    ? [
        'http://localhost:3001',
        'http://localhost:3000',
        'https://young-ocean-77920.herokuapp.com',
        'https://persona-share.netlify.app',
        'https://www.personashare.com',
        'https://personashare.com',
      ]
    : [
        'https://young-ocean-77920.herokuapp.com',
        'https://persona-share.netlify.app',
        'https://www.personashare.com',
        'https://personashare.com',
      ];

  // This should be set if we are behind proxy, for example nginx reverse proxy
  app.set('trust proxy', true);

  if (middleware) {
    app.use(middleware.requestHandler);
  }
  app.use(helmet());
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  if (middleware) {
    app.use(middleware.errorHandler);
  }

  app.enableCors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: true,
    credentials: true,
    origin: function(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (!allowedOrigins.includes(origin)) {
        const msg =
          'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }

      return callback(null, true);
    },
  });

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
