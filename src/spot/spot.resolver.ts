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
  async spots(): Promise<SpotType[] | null> {
    return await this.spotService.getSpots();
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
      managers: [],
      qrCodeLink: '',
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
  async updateSpot(
    @Args('spot') spot: UpdateSpotInput,
    @Args('uuid') uuid: string,
  ): Promise<SpotType> {
    return await this.spotService.updateSpot(spot, uuid);
  }

  @Mutation(() => Number)
  @UseGuards(GqlSessionGuard)
  async removeSpot(@Args('condition') input: SpotInput): Promise<number> {
    return await this.spotService.removeSpot(input);
  }
}
