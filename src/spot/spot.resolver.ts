import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { SpotService } from './spot.service';
import { SpotType } from './dto/spot.dto';
import { CreateSpotInput } from './inputs/create-spot.input';

@Resolver('Spot')
export class SpotResolver {
  constructor(private readonly spotService: SpotService) {}

  @Mutation(() => SpotType)
  async createSpot(@Args('spot') input: CreateSpotInput): Promise<SpotType> {
    const {
      uuid,
      name,
      description,
      logo,
      image,
      url,
      details,
      personaUUIDs,
    } = await this.spotService.create(input);
    return {
      uuid,
      name,
      description,
      logo,
      image,
      url,
      details,
      personaUUIDs,
    };
  }
}
