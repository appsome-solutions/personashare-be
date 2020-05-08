import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseModule } from '../firebase';
import { PersonaService } from './persona.service';
import { PersonaResolver } from './persona.resolver';
import { PersonaSchema } from './persona.schema';
import { GqlSelectionParserModule } from '../gql-selection-parser';
import { UserModule, UserSchema } from '../user';
import { QrCodeModule } from '../qrcode';
import { ConfigModule } from '../config';
import { RecommendationsModule } from '../recommendations';
import { AuthModule } from '../auth';
import { SpotModule } from '../spot';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Persona', schema: PersonaSchema },
      { name: 'User', schema: UserSchema },
    ]),
    FirebaseModule,
    GqlSelectionParserModule,
    QrCodeModule,
    ConfigModule,
    UserModule,
    AuthModule,
    RecommendationsModule,
    forwardRef(() => SpotModule),
  ],
  providers: [PersonaService, PersonaResolver],
  exports: [PersonaService],
})
export class PersonaModule {}
