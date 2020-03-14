import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SpotDocument, SpotInterface } from './interfaces/spot.interfaces';
import { SpotInput, UpdateSpotInput } from './inputs';
import { SpotType } from './dto/spot.dto';
import { MongoService } from '../mongo-service/mongo.service';
import { ConfigService } from '../config';
import { QrCodeService } from '../qrcode';
import { UserService } from '../user';

@Injectable()
export class SpotService {
  mongoService: MongoService<Model<SpotDocument>>;

  constructor(
    @InjectModel('Spot')
    private readonly spotModel: Model<SpotDocument>,
    private readonly configService: ConfigService,
    private readonly qrCodeService: QrCodeService,
    private readonly userService: UserService,
  ) {
    this.mongoService = new MongoService(this.spotModel);
  }

  async createSpot(spot: SpotInterface): Promise<SpotDocument> {
    // TODO: will be change to the domain
    const { baseUrl, applicationPort } = this.configService;
    const { uuid, owner } = spot;

    const user = await this.userService.getUser({ uuid: owner });

    const url = `${baseUrl}:${applicationPort}/persona/${uuid}`;
    const assetPath = `qrcodes/spot_${uuid}.svg`;

    const qrCodeLink = await this.qrCodeService.uploadQrCodeWithLogo(
      assetPath,
      url,
    );

    const spotDoc: SpotInterface = {
      ...spot,
      qrCodeLink,
    };

    const newSpot = await this.mongoService.create<SpotInterface, SpotDocument>(
      spotDoc,
    );

    user.spots = user.spots.concat(uuid);

    await user.save();

    return newSpot;
  }

  async updateSpot(spot: UpdateSpotInput, uuid: string): Promise<SpotDocument> {
    return await this.mongoService.update<UpdateSpotInput, SpotDocument>(spot, {
      uuid,
    });
  }

  async getSpot(condition: SpotInput): Promise<SpotType> {
    return await this.mongoService.findByMatch<SpotInput, SpotType>(condition);
  }

  async getSpots(): Promise<SpotType[]> {
    return await this.mongoService.findAll<SpotType>();
  }

  async removeSpot(condition: SpotInput): Promise<number> {
    return await this.mongoService.remove<SpotInput>(condition);
  }
}
