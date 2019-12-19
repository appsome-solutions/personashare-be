import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { v4 } from 'uuid';
import { SpotService } from './spot.service';
import { SpotType } from './dto/spot.dto';
import {
  ConnectPersonaToSpotInput,
  CreateSpotInput,
  SpotInput,
  UpdateSpotInput,
} from './inputs';
import { SpotInterface } from './interfaces/spot.interfaces';
import { GqlSessionGuard } from '../guards';

@Resolver('Spot')
export class SpotResolver {
  constructor(private readonly spotService: SpotService) {}

  @Query(() => [SpotType])
  async getSpot(@Args('condition') input: SpotInput): Promise<SpotType[]> {
    return await this.spotService.getSpot(input);
  }

  @Query(() => [SpotType])
  async getSpots(): Promise<SpotType[]> {
    return await this.spotService.getSpots();
  }

  @Mutation(() => SpotType)
  @UseGuards(GqlSessionGuard)
  async createSpot(@Args('spot') input: CreateSpotInput): Promise<SpotType> {
    const spotDoc: SpotInterface = {
      ...input,
      uuid: v4(),
    };

    return await this.spotService.createSpot(spotDoc);
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

  @Mutation(() => SpotType)
  @UseGuards(GqlSessionGuard)
  async connectPersona(
    @Args('input') input: ConnectPersonaToSpotInput,
  ): Promise<SpotType> {
    return await this.spotService.connectPersona(input);
  }
}
