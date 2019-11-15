import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PersonaEventService } from './persona-event.service';
import { PersonaEventResolver } from './persona-event.resolver';
import { PersonaEventSchema } from './persona-event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PersonaEvent', schema: PersonaEventSchema },
    ]),
  ],
  providers: [PersonaEventService, PersonaEventResolver],
  exports: [PersonaEventService],
})
export class PersonaEventModule {}
