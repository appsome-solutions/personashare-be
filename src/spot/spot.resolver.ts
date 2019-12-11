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
import { GqlAuthGuard } from '../auth';
import { SpotInterface } from './interfaces/spot.interfaces';

@Resolver('Spot')
export class SpotResolver {
  constructor(private readonly spotService: SpotService) {}

  @Query(() => [SpotType])
  async getSpot(@Args('condition') input: SpotInput): Promise<SpotType[]> {
    return await this.spotService.findByMatch(input);
  }

  @Query(() => [SpotType])
  async getSpots(): Promise<SpotType[]> {
    return await this.spotService.findAll();
  }

  @Mutation(() => SpotType)
  @UseGuards(GqlAuthGuard)
  async createSpot(@Args('spot') input: CreateSpotInput): Promise<SpotType> {
    const spotDoc: SpotInterface = {
      ...input,
      uuid: v4(),
    };

    return await this.spotService.create(spotDoc);
  }

  @Mutation(() => SpotType)
  @UseGuards(GqlAuthGuard)
  async updateSpot(
    @Args('spot') spot: UpdateSpotInput,
    @Args('uuid') uuid: string,
  ): Promise<SpotType> {
    return await this.spotService.update(spot, uuid);
  }

  @Mutation(() => Number)
  @UseGuards(GqlAuthGuard)
  async removeSpot(@Args('condition') input: SpotInput): Promise<number> {
    return await this.spotService.remove(input);
  }

  @Mutation(() => SpotType)
  @UseGuards(GqlAuthGuard)
  async connectPersona(
    @Args('input') input: ConnectPersonaToSpotInput,
  ): Promise<SpotType> {
    return await this.spotService.connectPersona(input);
  }
}
