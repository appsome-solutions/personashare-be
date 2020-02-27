import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlSessionGuard } from '../guards';
import { ConnectPersonaInput, UpdatePersonaInput } from '../shared';
import { PersonaService } from './persona.service';
import { PersonaType } from './dto/persona.dto';
import { PersonaInput } from './input';

@Resolver('Persona')
export class PersonaResolver {
  constructor(private readonly personaService: PersonaService) {}

  @Query(() => PersonaType, { nullable: true })
  async persona(@Args('uuid') uuid: string): Promise<PersonaType | null> {
    const input: PersonaInput = {
      uuid,
    };
    return await this.personaService.getPersona(input);
  }

  @Query(() => [PersonaType], { nullable: true })
  async personas(): Promise<PersonaType[] | null> {
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
