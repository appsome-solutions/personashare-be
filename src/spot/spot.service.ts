import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SpotDocument, SpotInterface } from './interfaces/spot.interfaces';
import { SpotInput, UpdateSpotInput } from './inputs';
import { SpotType } from './dto/spot.dto';
import { MongoService } from '../mongo-service/mongo.service';
import { ConfigService } from '../config';
import { QrCodeService } from '../qrcode';
import { UserService } from '../user';
import { PersonaService } from '../persona';

@Injectable()
export class SpotService {
  mongoService: MongoService<Model<SpotDocument>>;

  constructor(
    @InjectModel('Spot')
    private readonly spotModel: Model<SpotDocument>,
    private readonly configService: ConfigService,
    private readonly qrCodeService: QrCodeService,
    private readonly userService: UserService,
    private readonly personaService: PersonaService,
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

  async participate(
    uuid: string,
    spotId: string,
    personaId: string,
  ): Promise<SpotDocument> {
    const user = await this.userService.getUser({
      uuid,
    });

    if (!user.personaUUIDs.includes(personaId)) {
      throw new MethodNotAllowedException(
        'Cannot participate with given persona',
      );
    }

    const persona = await this.personaService.getPersona({
      uuid: personaId,
    });

    const spot = await this.getSpot({
      uuid: spotId,
    });

    if (!spot.participants.includes(persona.uuid)) {
      spot.participants = spot.participants.concat(spotId);

      await spot.save();
    }

    return spot;
  }

  async addManager(
    uuid: string,
    spotId: string,
    personaId: string,
  ): Promise<SpotDocument> {
    const user = await this.userService.getUser({
      uuid,
    });

    if (!user.spots.includes(spotId)) {
      throw new MethodNotAllowedException(
        'Cannot add manager to the given spot',
      );
    }

    const persona = await this.personaService.getPersona({
      uuid: personaId,
    });

    const spot = await this.getSpot({
      uuid: spotId,
    });

    if (!spot.managers.includes(persona.uuid)) {
      spot.managers = spot.managers.concat(personaId);

      await spot.save();
    }

    return spot;
  }

  async updateSpot(spot: UpdateSpotInput, uuid: string): Promise<SpotDocument> {
    return await this.mongoService.update<UpdateSpotInput, SpotDocument>(spot, {
      uuid,
    });
  }

  async getSpot(condition: SpotInput): Promise<SpotDocument> {
    return await this.mongoService.findByMatch<SpotInput, SpotDocument>(
      condition,
    );
  }

  async getSpots(): Promise<SpotType[]> {
    return await this.mongoService.findAll<SpotType>();
  }

  async removeSpot(condition: SpotInput): Promise<number> {
    return await this.mongoService.remove<SpotInput>(condition);
  }
}
