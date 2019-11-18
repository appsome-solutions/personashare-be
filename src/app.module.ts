import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from './config';
import { ExampleModule } from './example';
import { QrCodeModule } from './qrcode';
import { NgrokModule } from './ngrok';
import { SpotModule } from './spot';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      context: ({ req }: any) => ({ req }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.MongoDBURI,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    ExampleModule,
    QrCodeModule,
    NgrokModule,
    SpotModule,
  ],
  controllers: [AppController],
  providers: [AppService, ExampleModule],
})
export class AppModule {}
