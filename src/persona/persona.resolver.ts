import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver,
} from '@nestjs/graphql';
import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import { GqlSessionGuard } from '../guards';
import { ConnectPersonaInput, UpdatePersonaInput } from '../shared';
import { CreateShareableInput } from '../shared/input/create-shareable.input';
import { PersonaService } from './persona.service';
import { PersonaType } from './dto/persona.dto';
import { PersonaInput } from './input';
import { GQLContext } from '../app.interfaces';
import { AddPersonaInput } from '../user/inputs';
import { FirebaseService } from '../firebase';
import { AgregatedPersona } from './dto/agreagated.persona.dto';
import { SpotService } from '../spot';
import { SpotType } from '../spot/dto/spot.dto';

@Resolver((_of: void) => AgregatedPersona)
export class PersonaResolver {
  constructor(
    private readonly personaService: PersonaService,
    private readonly firebaseService: FirebaseService,
    @Inject(forwardRef(() => SpotService))
    private readonly spotService: SpotService,
  ) {}

  @Query(() => AgregatedPersona, { nullable: true })
  async persona(@Args('uuid') uuid: string): Promise<AgregatedPersona | null> {
    const input: PersonaInput = {
      uuid,
      isActive: true,
    };

    return await this.personaService.getPersona(input);
  }

  @ResolveProperty(() => [PersonaType])
  async contactBook(@Parent() persona: PersonaType): Promise<PersonaType[]> {
    const result = await this.personaService.getPersonasByIds(
      persona.contactBook,
    );

    return result ? result : [];
  }

  @ResolveProperty(() => [SpotType])
  async spotBook(@Parent() persona: PersonaType): Promise<SpotType[]> {
    const result = await this.spotService.getSpotsByIds(persona.spotBook);

    return result ? result : [];
  }

  @ResolveProperty(() => [PersonaType])
  async visibilityList(@Parent() persona: PersonaType): Promise<PersonaType[]> {
    const result = await this.personaService.getPersonasByIds(
      persona.visibilityList,
    );

    return result ? result : [];
  }

  @ResolveProperty(() => [PersonaType])
  async recommendList(@Parent() persona: PersonaType): Promise<PersonaType[]> {
    const result = await this.personaService.getPersonasByIds(
      persona.recommendList,
    );

    return result ? result : [];
  }

  @Query(() => [PersonaType], { nullable: true })
  @UseGuards(GqlSessionGuard)
  async userPersonas(@Context() context: GQLContext): Promise<PersonaType[]> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.personaService.getUserPersonas(uid);
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
    @Context() context: GQLContext,
  ): Promise<PersonaType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.personaService.updatePersona(persona, uuid, uid);
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

  @Mutation(() => PersonaType)
  @UseGuards(GqlSessionGuard)
  async savePersona(
    @Args('personaUuid') personaUuid: string,
    @Args('savedPersonaUuid') savedPersonaUuid: string,
    @Context() context: GQLContext,
  ): Promise<PersonaType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.personaService.savePersona(
      personaUuid,
      savedPersonaUuid,
      uid,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlSessionGuard)
  async removePersona(
    @Args('personaUuid') personaUuid: string,
    @Context() context: GQLContext,
  ): Promise<boolean> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);
    const personaInput: UpdatePersonaInput = {
      isActive: false,
    };

    const updatedPersona = await this.personaService.updatePersona(
      personaInput,
      personaUuid,
      uid,
    );

    return !updatedPersona.isActive;
  }
}
