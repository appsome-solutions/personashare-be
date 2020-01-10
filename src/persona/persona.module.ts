import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseModule } from '../firebase';
import { PersonaService } from './persona.service';
import { PersonaResolver } from './persona.resolver';
import { PersonaSchema } from './persona.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Persona', schema: PersonaSchema }]),
    FirebaseModule,
  ],
  providers: [PersonaService, PersonaResolver],
  exports: [PersonaService],
})
export class PersonaModule {}
