import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { v4 } from 'uuid';
import { SpotService } from './spot.service';
import { SpotType } from './dto/spot.dto';
import { SpotInput, UpdateSpotInput } from './inputs';
import { SpotInterface } from './interfaces/spot.interfaces';
import { GqlSessionGuard } from '../guards';
import { CreateShareableInput } from '../shared/input/create-shareable.input';
import { GQLContext } from '../app.interfaces';
import { FirebaseService } from '../firebase';

@Resolver('Spot')
export class SpotResolver {
  constructor(
    private readonly spotService: SpotService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Query(() => SpotType, { nullable: true })
  async spot(@Args('condition') input: SpotInput): Promise<SpotType | null> {
    return await this.spotService.getSpot(input);
  }

  @Query(() => [SpotType], { nullable: true })
  @UseGuards(GqlSessionGuard)
  async userSpots(@Context() context: GQLContext): Promise<SpotType[]> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.spotService.getUserSpots(uid);
  }

  @Mutation(() => SpotType)
  @UseGuards(GqlSessionGuard)
  async createSpot(
    @Args('spot') spot: CreateShareableInput,
    @Context() context: GQLContext,
  ): Promise<SpotType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    const spotDoc: SpotInterface = {
      ...spot,
      owner: uid,
      uuid: v4(),
      participants: [],
      personaUUIDs: [],
      networkList: [],
      recommendList: [],
      spotNetworkList: [],
      spotRecommendList: [],
      visibilityList: [],
      contactBook: [],
      managers: [],
      qrCodeLink: '',
      isActive: true,
    };

    return await this.spotService.createSpot(spotDoc);
  }

  @Mutation(() => SpotType)
  @UseGuards(GqlSessionGuard)
  async participate(
    @Args('spotId') spotId: string,
    @Args('personaId') personaId: string,
    @Context() context: GQLContext,
  ): Promise<SpotType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.spotService.participate(uid, spotId, personaId);
  }

  @Mutation(() => SpotType)
  @UseGuards(GqlSessionGuard)
  async addManager(
    @Args('spotId') spotId: string,
    @Args('personaId') personaId: string,
    @Context() context: GQLContext,
  ): Promise<SpotType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.spotService.addManager(uid, spotId, personaId);
  }

  @Mutation(() => SpotType)
  @UseGuards(GqlSessionGuard)
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
  @UseGuards(GqlSessionGuard)
  async saveSpot(
    @Args('spotUuid') spotUuid: string,
    @Args('savedSpotUuid') savedSpotUuid: string,
    @Context() context: GQLContext,
  ): Promise<SpotType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.spotService.saveSpot(spotUuid, savedSpotUuid, uid);
  }

  @Mutation(() => SpotType)
  @UseGuards(GqlSessionGuard)
  async updateSpot(
    @Args('spot') spot: UpdateSpotInput,
    @Args('uuid') uuid: string,
    @Context() context: GQLContext,
  ): Promise<SpotType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.spotService.updateSpot(spot, uuid, uid);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlSessionGuard)
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
