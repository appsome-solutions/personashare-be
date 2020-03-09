import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MongoService } from '../mongo-service/mongo.service';
import {
  ConnectPersonaInput,
  connectPersona,
  UpdatePersonaInput,
} from '../shared';
import {
  PersonaDocument,
  PersonaInterface,
} from './interfaces/persona.interfaces';
import { PersonaInput } from './input';
import { PersonaType } from './dto/persona.dto';

@Injectable()
export class PersonaService {
  mongoService: MongoService<Model<PersonaDocument>>;

  constructor(
    @InjectModel('Persona')
    private readonly personaModel: Model<PersonaDocument>,
  ) {
    this.mongoService = new MongoService(this.personaModel);
  }

  async createPersona(persona: PersonaInterface): Promise<PersonaDocument> {
    return await this.mongoService.create<PersonaInterface, PersonaDocument>(
      persona,
    );
  }

  async updatePersona(
    persona: UpdatePersonaInput,
    uuid: string,
  ): Promise<PersonaDocument> {
    return await this.mongoService.update<UpdatePersonaInput, PersonaDocument>(
      persona,
      {
        uuid,
      },
    );
  }

  async getPersona(condition: PersonaInput): Promise<PersonaDocument> {
    return await this.mongoService.findByMatch<PersonaInput, PersonaDocument>(
      condition,
    );
  }

  async getPersonas(): Promise<PersonaType[]> {
    return await this.mongoService.findAll<PersonaType>();
  }

  async removePersona(condition: PersonaInput): Promise<number> {
    return await this.mongoService.remove<PersonaInput>(condition);
  }

  async connectPersona(payload: ConnectPersonaInput): Promise<PersonaDocument> {
    const persona = await connectPersona(payload, this.personaModel);
    return await persona.save();
  }
}
