import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GQLContext } from './app.interfaces';
import { ConfigModule, ConfigService } from './config';
import { ExampleModule } from './example';
import { QrCodeModule } from './qrcode';
import { NgrokModule } from './ngrok';
import { SpotModule } from './spot';
import { FirebaseModule } from './firebase';
import { AuthModule } from './auth';
import { UserModule } from './user';
import { PersonaModule } from './persona';
import { GqlSelectionParserModule } from './gql-selection-parser';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      context: ({ req, res }: GQLContext) => ({ req, res }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.MongoDBURI,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    ExampleModule,
    QrCodeModule,
    NgrokModule,
    SpotModule,
    FirebaseModule,
    AuthModule,
    UserModule,
    PersonaModule,
    GqlSelectionParserModule,
  ],
  controllers: [AppController],
  providers: [AppService, ExampleModule],
})
export class AppModule {}
