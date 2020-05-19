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
import { GqlUserGuard } from '../guards';
import { ConnectPersonaInput, UpdatePersonaInput } from '../shared';
import { PersonaService } from './persona.service';
import { PersonaType } from './dto/persona.dto';
import { CreatePersonaInput, PersonaInput } from './input';
import { GQLContext } from '../app.interfaces';
import { AddPersonaInput } from '../user/inputs';
import { FirebaseService } from '../firebase';
import { AgregatedPersona } from './dto/agreagated.persona.dto';
import { SpotService } from '../spot';
import { AgregatedSpot } from '../spot/dto/agregated.spot.dto';

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

  @ResolveProperty(() => [AgregatedPersona])
  async contactBook(
    @Parent() persona: PersonaType,
  ): Promise<AgregatedPersona[]> {
    const result = await this.personaService.getPersonasByIds(
      persona.contactBook,
    );

    return result ? result : [];
  }

  @ResolveProperty(() => [AgregatedSpot])
  async spotBook(@Parent() persona: PersonaType): Promise<AgregatedSpot[]> {
    const result = await this.spotService.getSpotsByIds(persona.spotBook);

    return result ? result : [];
  }

  @ResolveProperty(() => [AgregatedPersona])
  async visibilityList(
    @Parent() persona: PersonaType,
  ): Promise<AgregatedPersona[]> {
    const result = await this.personaService.getPersonasByIds(
      persona.visibilityList,
    );

    return result ? result : [];
  }

  @ResolveProperty(() => [AgregatedSpot])
  async spotVisibilityList(
    @Parent() persona: PersonaType,
  ): Promise<AgregatedSpot[]> {
    const result = await this.spotService.getSpotsByIds(
      persona.spotVisibilityList,
    );

    return result ? result : [];
  }

  @ResolveProperty(() => [AgregatedPersona])
  async networkList(
    @Parent() persona: PersonaType,
  ): Promise<AgregatedPersona[]> {
    const result = await this.personaService.getPersonasByIds(
      persona.networkList,
    );

    return result ? result : [];
  }

  @ResolveProperty(() => [AgregatedSpot])
  async spotNetworkList(
    @Parent() persona: PersonaType,
  ): Promise<AgregatedSpot[]> {
    const result = await this.spotService.getSpotsByIds(
      persona.spotNetworkList,
    );

    return result ? result : [];
  }

  @ResolveProperty(() => [AgregatedPersona])
  async recommendList(
    @Parent() persona: PersonaType,
  ): Promise<AgregatedPersona[]> {
    const result = await this.personaService.getPersonasByIds(
      persona.recommendList,
    );

    return result ? result : [];
  }

  @ResolveProperty(() => [AgregatedSpot])
  async spotRecommendList(
    @Parent() persona: PersonaType,
  ): Promise<AgregatedSpot[]> {
    const result = await this.spotService.getSpotsByIds(
      persona.spotRecommendList,
    );

    return result ? result : [];
  }

  @Query(() => [AgregatedPersona], { nullable: true })
  @UseGuards(GqlUserGuard)
  async userPersonas(
    @Context() context: GQLContext,
  ): Promise<AgregatedPersona[]> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.personaService.getUserPersonas(uid);
  }

  @Mutation(() => PersonaType)
  @UseGuards(GqlUserGuard)
  async createPersona(
    @Args('persona') persona: CreatePersonaInput,
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
  @UseGuards(GqlUserGuard)
  async setDefaultPersona(
    @Args('uuid') uuid: string,
    @Context() context: GQLContext,
  ): Promise<PersonaType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.personaService.setDefaultPersona(uuid, uid);
  }

  @Mutation(() => PersonaType)
  @UseGuards(GqlUserGuard)
  async updatePersona(
    @Args('persona') persona: UpdatePersonaInput,
    @Args('uuid') uuid: string,
    @Context() context: GQLContext,
  ): Promise<PersonaType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.personaService.updatePersona(persona, uuid, uid);
  }

  @Mutation(() => PersonaType)
  @UseGuards(GqlUserGuard)
  async connectPersona(
    @Args('input') input: ConnectPersonaInput,
  ): Promise<PersonaType> {
    return await this.personaService.connectPersona(input);
  }

  @Mutation(() => PersonaType)
  @UseGuards(GqlUserGuard)
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
  @UseGuards(GqlUserGuard)
  async savePersona(
    @Args('savedPersonaUuid') savedPersonaUuid: string,
    @Context() context: GQLContext,
  ): Promise<PersonaType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.personaService.savePersona(savedPersonaUuid, uid);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlUserGuard)
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
