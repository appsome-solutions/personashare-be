import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { v4 } from 'uuid';
import { SpotDocument, SpotInterface } from './interfaces/spot.interfaces';
import {
  ConnectPersonaToSpotInput,
  CreateSpotInput,
  SpotInput,
  UpdateSpotInput,
} from './inputs';
import { SpotType } from './dto/spot.dto';

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

  async update(spot: UpdateSpotInput): Promise<SpotDocument> {
    const updatedSpot = await this.spotModel.findOneAndUpdate(
      { uuid: spot.uuid },
      spot,
    );

    if (!updatedSpot) {
      throw new NotFoundException(
        `Cant find spot with given uuid: ${spot.uuid}`,
      );
    }

    return updatedSpot;
  }

  async findByMatch(condition: SpotInput): Promise<SpotType[]> {
    const spots = await this.spotModel.find(condition).exec();
    const entries: string[] = Object.keys(condition).map(
      entry => `${entry}: ${condition[entry as keyof SpotInput]}`,
    );

    if (!spots || spots.length < 1) {
      throw new NotFoundException(
        `Can't find any spot for condition: { ${entries} }`,
      );
    }

    return spots;
  }

  async findAll(): Promise<SpotType[]> {
    return await this.spotModel.find().exec();
  }

  async removeSpot(condition: SpotInput): Promise<number> {
    const { deletedCount } = await this.spotModel.deleteMany(condition);
    return deletedCount ? deletedCount : 0;
  }

  async connectPersona(
    payload: ConnectPersonaToSpotInput,
  ): Promise<SpotDocument> {
    const { uuid, personaUuid } = payload;
    const spot = await this.spotModel.findOne({ uuid });

    if (!spot) {
      throw new NotFoundException(`Can't find spot by uuid: ${uuid}`);
    }

    if (!spot.personaUUIDs) {
      spot.personaUUIDs = [personaUuid];
    } else {
      if (!spot.personaUUIDs.includes(personaUuid)) {
        spot.personaUUIDs = spot.personaUUIDs.concat(personaUuid);
      } else {
        return await spot;
      }
    }

    return await spot.save();
  }
}
