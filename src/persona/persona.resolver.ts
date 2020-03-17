import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlSessionGuard } from '../guards';
import { ConnectPersonaInput, UpdatePersonaInput } from '../shared';
import { CreateShareableInput } from '../shared/input/create-shareable.input';
import { PersonaService } from './persona.service';
import { PersonaType } from './dto/persona.dto';
import { PersonaInput } from './input';
import { GQLContext } from '../app.interfaces';
import { AddPersonaInput, RemovePersonaInput } from '../user/inputs';
import { FirebaseService } from '../firebase';

@Resolver('Persona')
export class PersonaResolver {
  constructor(
    private readonly personaService: PersonaService,
    private readonly firebaseService: FirebaseService,
  ) {}

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
  async createPersona(
    @Args('persona') persona: CreateShareableInput,
    @Context() context: GQLContext,
  ): Promise<PersonaType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    const payload: AddPersonaInput = {
      uuid: uid,
      persona,
    };

    return await this.personaService.createPersona(payload);
  }

  @Mutation(() => Number)
  @UseGuards(GqlSessionGuard)
  async removePersona(
    @Args('payload') payload: RemovePersonaInput,
  ): Promise<number> {
    return await this.personaService.removePersona(payload);
  }

  @Mutation(() => PersonaType)
  @UseGuards(GqlSessionGuard)
  async setDefaultPersona(
    @Args('uuid') uuid: string,
    @Context() context: GQLContext,
  ): Promise<PersonaType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);
    return await this.personaService.setDefaultPersona(uuid, uid);
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

  @Mutation(() => PersonaType)
  @UseGuards(GqlSessionGuard)
  async recommendPersona(
    @Args('personaUuid') personaUuid: string,
    @Args('recommendedPersonaUuid') recommendedPersonaUuid: string,
    @Context() context: GQLContext,
  ): Promise<PersonaType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.personaService.recommendPersona(
      personaUuid,
      recommendedPersonaUuid,
      uid,
    );
  }
}
