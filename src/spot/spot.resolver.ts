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
import { PersonaService, PersonaType } from '../persona';

@Resolver((_of: void) => AgregatedSpot)
@Resolver('Spot')
export class SpotResolver {
  constructor(
    private readonly spotService: SpotService,
    private readonly firebaseService: FirebaseService,
    @Inject(forwardRef(() => PersonaService))
    private readonly personaService: PersonaService,
  ) {}

  @ResolveProperty(() => [PersonaType])
  async owner(@Parent() spot: SpotType): Promise<PersonaType[]> {
    const result = ((await this.personaService.getPersona({
      uuid: spot.owner,
    })) as unknown) as PersonaType[];

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
  ): Promise<SpotType> {
    const { card, page, personaId } = spot;

    const spotDoc: SpotInterface = {
      card,
      page,
      owner: personaId,
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
      qrCodeLink: '',
      isActive: true,
    };

    return await this.spotService.createSpot(spotDoc);
  }

  @Mutation(() => SpotType)
  @UseGuards(GqlUserGuard)
  async participate(
    @Args('spotId') spotId: string,
    @Args('personaId') personaId: string,
    @Context() context: GQLContext,
  ): Promise<SpotType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.spotService.participate(uid, spotId, personaId);
  }

  @Mutation(() => SpotType)
  @UseGuards(GqlUserGuard)
  async addManager(
    @Args('spotId') spotId: string,
    @Args('personaId') personaId: string,
    @Context() context: GQLContext,
  ): Promise<SpotType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.spotService.addManager(uid, spotId, personaId);
  }

  @Mutation(() => SpotType)
  @UseGuards(GqlUserGuard)
  async recommendSpot(
    @Args('personaUuid') personaUuid: string,
    @Args('recommendedSpotUuid') recommendedSpotUuid: string,
    @Context() context: GQLContext,
  ): Promise<SpotType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.spotService.recommendSpot(
      personaUuid,
      recommendedSpotUuid,
      uid,
    );
  }

  @Mutation(() => SpotType)
  @UseGuards(GqlUserGuard)
  async saveSpot(
    @Args('spotUuid') spotUuid: string,
    @Args('savedSpotUuid') savedSpotUuid: string,
    @Context() context: GQLContext,
  ): Promise<SpotType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.spotService.saveSpot(spotUuid, savedSpotUuid, uid);
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
    const spotInput: UpdateSpotInput = {
      isActive: false,
    };

    const updatedSpot = await this.spotService.updateSpot(
      spotInput,
      spotUuid,
      uid,
    );

    return !updatedSpot.isActive;
  }
}
