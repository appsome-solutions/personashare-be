import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SpotDocument, SpotInterface } from './interfaces/spot.interfaces';
import { SpotInput, UpdateSpotInput } from './inputs';
import { SpotType } from './dto/spot.dto';
import { MongoService } from '../mongo-service/mongo.service';
import { ConnectPersonaInput, connectPersona } from '../shared';

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
    return await this.mongoService.update<UpdateSpotInput, SpotDocument>(spot, {
      uuid,
    });
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

  async connectPersona(payload: ConnectPersonaInput): Promise<SpotDocument> {
    return await connectPersona(payload, this.spotModel);
  }
}
