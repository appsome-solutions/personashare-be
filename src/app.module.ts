import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GQLContext } from './app.interfaces';
import { ConfigModule, ConfigService } from './config';
import { QrCodeModule } from './qrcode';
import { NgrokModule } from './ngrok';
import { SpotModule } from './spot';
import { FirebaseModule } from './firebase';
import { AuthModule } from './auth';
import { UserModule } from './user';
import { PersonaModule } from './persona';
import { GqlSelectionParserModule } from './gql-selection-parser';
import { MailchimpModule } from './mailchimp';
import { RecommendationsModule } from './recommendations';
import { FeatureKindModule } from './feature-kind';

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
      cors: {
        credentials: true,
        origin: true,
      },
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
    QrCodeModule,
    NgrokModule,
    SpotModule,
    FirebaseModule,
    AuthModule,
    UserModule,
    PersonaModule,
    GqlSelectionParserModule,
    MailchimpModule,
    RecommendationsModule,
    FeatureKindModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
