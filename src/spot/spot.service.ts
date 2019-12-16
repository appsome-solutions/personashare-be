import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SpotDocument, SpotInterface } from './interfaces/spot.interfaces';
import {
  ConnectPersonaToSpotInput,
  SpotInput,
  UpdateSpotInput,
} from './inputs';
import { SpotType } from './dto/spot.dto';
import { MongoService } from '../mongo-service/mongo.service';

@Injectable()
export class SpotService {
  mongoService: MongoService<Model<SpotDocument>>;

  constructor(
    @InjectModel('Spot')
    private readonly spotModel: Model<SpotDocument>,
  ) {
    this.mongoService = new MongoService(this.spotModel);
  }

  async createSpot(spot: SpotInterface): Promise<SpotDocument> {
    return await this.mongoService.create<SpotInterface, SpotDocument>(spot);
  }

  async updateSpot(spot: UpdateSpotInput, uuid: string): Promise<SpotDocument> {
    return await this.mongoService.update<UpdateSpotInput, SpotDocument>(
      spot,
      uuid,
    );
  }

  async getSpot(condition: SpotInput): Promise<SpotType[]> {
    return await this.mongoService.findByMatch<SpotInput, SpotType>(condition);
  }

  async getSpots(): Promise<SpotType[]> {
    return await this.mongoService.findAll<SpotType>();
  }

  async removeSpot(condition: SpotInput): Promise<number> {
    return await this.mongoService.remove<SpotInput>(condition);
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
