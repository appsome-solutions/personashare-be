import {
  Resolver,
  Mutation,
  Args,
  Query,
  Context,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import { v4 } from 'uuid';
import { SpotService } from './spot.service';
import { SpotType } from './dto/spot.dto';
import { SpotInput, UpdateSpotInput } from './inputs';
import { SpotInterface } from './interfaces/spot.interfaces';
import { GqlUserGuard } from '../guards';
import { CreateShareableInput } from '../shared/input/create-shareable.input';
import { GQLContext } from '../app.interfaces';
import { FirebaseService } from '../firebase';
import { AgregatedSpot } from './dto/agregated.spot.dto';
import { PersonaService } from '../persona';
import { AgregatedPersona } from '../persona/dto/agreagated.persona.dto';
import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

@Resolver((_of: void) => AgregatedSpot)
@Resolver('Spot')
export class SpotResolver {
  dayjs = dayjs.extend(utc);

  constructor(
    private readonly spotService: SpotService,
    private readonly firebaseService: FirebaseService,
    @Inject(forwardRef(() => PersonaService))
    private readonly personaService: PersonaService,
  ) {}

  @ResolveProperty(() => AgregatedPersona)
  async owner(@Parent() spot: SpotType): Promise<AgregatedPersona> {
    const result = ((await this.personaService.getPersona({
      uuid: spot.owner,
    })) as unknown) as AgregatedPersona;

    if (result) {
      return result;
    } else {
      throw new Error("Owner doesn't exists");
    }
  }

  @ResolveProperty(() => [AgregatedPersona])
  async networkList(
    @Parent() spot: SpotType,
    @Context() context: GQLContext,
  ): Promise<AgregatedPersona[]> {
    try {
      const { uid } = await this.firebaseService.getClaimFromToken(context);

      if (spot.userId !== uid) {
        return [];
      }
    } catch (e) {
      return [];
    }

    const result = ((await this.personaService.getPersonasByIds(
      spot.networkList,
    )) as unknown) as AgregatedPersona[];

    return result ? result : [];
  }

  @ResolveProperty(() => [AgregatedPersona])
  async recommendList(@Parent() spot: SpotType): Promise<AgregatedPersona[]> {
    const result = ((await this.personaService.getPersonasByIds(
      spot.recommendList,
    )) as unknown) as AgregatedPersona[];

    return result ? result : [];
  }

  @ResolveProperty(() => [AgregatedPersona])
  async contactBook(@Parent() spot: SpotType): Promise<AgregatedPersona[]> {
    const result = ((await this.personaService.getPersonasByIds(
      spot.contactBook,
    )) as unknown) as AgregatedPersona[];

    return result ? result : [];
  }

  @ResolveProperty(() => [AgregatedPersona])
  async visibilityList(
    @Parent() spot: SpotType,
    @Context() context: GQLContext,
  ): Promise<AgregatedPersona[]> {
    try {
      const { uid } = await this.firebaseService.getClaimFromToken(context);

      if (spot.userId !== uid) {
        return [];
      }
    } catch (e) {
      return [];
    }

    const result = ((await this.personaService.getPersonasByIds(
      spot.visibilityList,
    )) as unknown) as AgregatedPersona[];

    return result ? result : [];
  }

  @ResolveProperty(() => [AgregatedPersona])
  async participants(@Parent() spot: SpotType): Promise<AgregatedPersona[]> {
    const result = ((await this.personaService.getPersonasByIds(
      spot.participants,
    )) as unknown) as AgregatedPersona[];

    return result ? result : [];
  }

  @ResolveProperty(() => [AgregatedPersona])
  async managers(@Parent() spot: SpotType): Promise<AgregatedPersona[]> {
    const result = ((await this.personaService.getPersonasByIds(
      spot.managers,
    )) as unknown) as AgregatedPersona[];

    return result ? result : [];
  }

  @Query(() => AgregatedSpot, { nullable: true })
  async spot(@Args('uuid') uuid: string): Promise<AgregatedSpot | null> {
    const input: SpotInput = {
      uuid,
      isActive: true,
    };
    return await this.spotService.getSpot(input);
  }

  @Query(() => [SpotType], { nullable: true })
  @UseGuards(GqlUserGuard)
  async userSpots(@Context() context: GQLContext): Promise<SpotType[]> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.spotService.getUserSpots(uid);
  }

  @Mutation(() => SpotType)
  @UseGuards(GqlUserGuard)
  async createSpot(
    @Args('spot') spot: CreateShareableInput,
    @Context() context: GQLContext,
  ): Promise<SpotType> {
    const { card, page } = spot;
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    const spotDoc: SpotInterface = {
      card,
      page,
      owner: '',
      userId: uid,
      uuid: v4(),
      participants: [],
      personaUUIDs: [],
      networkList: [],
      recommendList: [],
      spotNetworkList: [],
      spotRecommendList: [],
      visibilityList: [],
      spotVisibilityList: [],
      contactBook: [],
      spotBook: [],
      managers: [],
      invitedManagerEmails: [],
      qrCodeLink: '',
      isActive: true,
      createdAt: this.dayjs.utc().unix(),
    };

    return await this.spotService.createSpot(uid, spotDoc);
  }

  @Mutation(() => AgregatedSpot)
  @UseGuards(GqlUserGuard)
  async participate(
    @Args('spotId') spotId: string,
    @Context() context: GQLContext,
  ): Promise<AgregatedSpot> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.spotService.participate(uid, spotId);
  }

  @Mutation(() => SpotType)
  @UseGuards(GqlUserGuard)
  async addManager(
    @Args('spotId') spotId: string,
    @Args('personaId') personaId: string,
    @Args('email') email: string,
    @Context() context: GQLContext,
  ): Promise<SpotType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.spotService.addManager(uid, spotId, personaId, email);
  }

  @Mutation(() => SpotType)
  @UseGuards(GqlUserGuard)
  async recommendSpot(
    @Args('recommendedSpotUuid') recommendedSpotUuid: string,
    @Context() context: GQLContext,
  ): Promise<SpotType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.spotService.recommendSpot(recommendedSpotUuid, uid);
  }

  @Mutation(() => AgregatedPersona)
  @UseGuards(GqlUserGuard)
  async saveSpot(
    @Args('savedSpotUuid') savedSpotUuid: string,
    @Context() context: GQLContext,
  ): Promise<AgregatedPersona> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.spotService.saveSpot(savedSpotUuid, uid);
  }

  @Mutation(() => SpotType)
  @UseGuards(GqlUserGuard)
  async updateSpot(
    @Args('spot') spot: UpdateSpotInput,
    @Args('uuid') uuid: string,
    @Context() context: GQLContext,
  ): Promise<SpotType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.spotService.updateSpot(spot, uuid, uid);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlUserGuard)
  async removeSpot(
    @Args('spotUuid') spotUuid: string,
    @Context() context: GQLContext,
  ): Promise<boolean> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    const updatedSpot = await this.spotService.updateSpot(
      {
        isActive: false,
      },
      spotUuid,
      uid,
    );

    return !updatedSpot.isActive;
  }
}
