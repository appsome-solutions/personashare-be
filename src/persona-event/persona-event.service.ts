import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { v4 } from 'uuid';
import {
  PersonaEventDocument,
  PersonaEventInterface,
} from './interfaces/persona-event.interfaces';
import { CreatePersonaEventInput } from './inputs/create-persona-event.input';

@Injectable()
export class PersonaEventService {
  constructor(
    @InjectModel('PersonaEvent')
    private readonly personaEventModel: Model<PersonaEventDocument>,
  ) {}

  async create(
    personaEvent: CreatePersonaEventInput,
  ): Promise<PersonaEventDocument> {
    const personaEventDoc: PersonaEventInterface = {
      ...personaEvent,
      uuid: v4(),
    };
    const newPersonaEvent = new this.personaEventModel(personaEventDoc);

    return await newPersonaEvent.save();
  }
}
