import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { SpotService } from './spot.service';
import { SpotType } from './dto/spot.dto';
import {
  ConnectPersonaToSpotInput,
  CreateSpotInput,
  SpotInput,
  UpdateSpotInput,
} from './inputs';

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
  async createSpot(@Args('spot') input: CreateSpotInput): Promise<SpotType> {
    return await this.spotService.create(input);
  }

  @Mutation(() => SpotType)
  async updateSpot(@Args('spot') spot: UpdateSpotInput): Promise<SpotType> {
    return await this.spotService.update(spot);
  }

  @Mutation(() => Number)
  async removeSpot(@Args('condition') input: SpotInput): Promise<number> {
    return await this.spotService.removeSpot(input);
  }

  @Mutation(() => SpotType)
  async connectPersona(
    @Args('input') input: ConnectPersonaToSpotInput,
  ): Promise<SpotType> {
    return await this.spotService.connectPersona(input);
  }
}
