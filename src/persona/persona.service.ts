import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GQLContext } from '../app.interfaces';
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
import { GqlSelectionParserService } from '../gql-selection-parser';

@Injectable()
export class PersonaService {
  mongoService: MongoService<Model<PersonaDocument>>;

  constructor(
    @InjectModel('Persona')
    private readonly personaModel: Model<PersonaDocument>,
    private readonly gqlSelectionParserService: GqlSelectionParserService,
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

  async getPersona(
    condition: PersonaInput,
    context: GQLContext,
  ): Promise<PersonaType> {
    const fields = this.gqlSelectionParserService.getSelectionKeysFromQuery<
      PersonaType
    >(context, 'getPersona');
    return await this.mongoService.findByMatch<PersonaInput, PersonaType>(
      condition,
      fields,
    );
  }

  async getPersonas(): Promise<PersonaType[]> {
    return await this.mongoService.findAll<PersonaType>();
  }

  async removePersona(condition: PersonaInput): Promise<number> {
    return await this.mongoService.remove<PersonaInput>(condition);
  }

  async connectPersona(payload: ConnectPersonaInput): Promise<PersonaDocument> {
    return await connectPersona(payload, this.personaModel);
  }
}
