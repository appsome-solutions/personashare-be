import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { v4 } from 'uuid';
import { SpotDocument, SpotInterface } from './interfaces/spot.interfaces';
import { CreateSpotInput } from './inputs/create-spot.input';

@Injectable()
export class SpotService {
  constructor(
    @InjectModel('Spot')
    private readonly spotModel: Model<SpotDocument>,
  ) {}

  async create(spot: CreateSpotInput): Promise<SpotDocument> {
    const spotDoc: SpotInterface = {
      ...spot,
      uuid: v4(),
    };
    const newSpot = new this.spotModel(spotDoc);

    return await newSpot.save();
  }

  async findByMatch(
    condition: Partial<SpotInterface>,
  ): Promise<SpotInterface[]> {
    const spots = await this.spotModel.find(condition).exec();
    const entries: string[] = Object.keys(condition).map(
      entry => `${entry}: ${condition[entry as keyof Partial<SpotInterface>]}`,
    );

    if (!spots || spots.length < 1) {
      throw new NotFoundException(
        `Can't find any spot for condition: { ${entries} }`,
      );
    }

    return spots;
  }
}
