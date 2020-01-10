import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlSessionGuard } from '../guards';
import { ConnectPersonaInput } from '../shared';
import { PersonaService } from './persona.service';
import { PersonaType } from './dto/persona.dto';
import { PersonaInput } from './input';
import { UpdatePersonaInput } from '../shared/input/update-persona.input';

@Resolver('Persona')
export class PersonaResolver {
  constructor(private readonly personaService: PersonaService) {}

  @Query(() => PersonaType)
  async getPersona(
    @Args('condition') input: PersonaInput,
  ): Promise<PersonaType> {
    return await this.personaService.getPersona(input);
  }

  @Query(() => [PersonaType])
  async getPersonas(): Promise<PersonaType[]> {
    return await this.personaService.getPersonas();
  }

  @Mutation(() => PersonaType)
  @UseGuards(GqlSessionGuard)
  async updatePersona(
    @Args('persona') persona: UpdatePersonaInput,
    @Args('uuid') uuid: string,
  ): Promise<PersonaType> {
    return await this.personaService.updatePersona(persona, uuid);
  }

  @Mutation(() => PersonaType)
  @UseGuards(GqlSessionGuard)
  async connectPersona(
    @Args('input') input: ConnectPersonaInput,
  ): Promise<PersonaType> {
    return await this.personaService.connectPersona(input);
  }
}
