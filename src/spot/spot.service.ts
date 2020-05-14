import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  PartialSpotDocument,
  SpotDocument,
  SpotInterface,
} from './interfaces/spot.interfaces';
import { SpotInput, UpdateSpotInput } from './inputs';
import { SpotType } from './dto/spot.dto';
import { MongoService } from '../mongo-service/mongo.service';
import { ConfigService } from '../config';
import { QrCodeService } from '../qrcode';
import { UserService } from '../user';
import { PersonaService } from '../persona';
import { RecommendationsService } from '../recommendations';
import dayjs from 'dayjs';

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
    private readonly recommendationsService: RecommendationsService,
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

    if (!persona) {
      throw new Error('No persona found for given id');
    }

    const spot = await this.getSpot({
      uuid: spotId,
    });

    if (!spot) {
      throw new Error('No spot found for given id');
    }

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

    if (!persona) {
      throw new Error('No persona found for given id');
    }

    const spot = await this.getSpot({
      uuid: spotId,
    });

    if (!spot) {
      throw new Error('No spot found for given id');
    }

    if (!spot.managers.includes(persona.uuid)) {
      spot.managers = spot.managers.concat(personaId);

      await spot.save();
    }

    return spot;
  }

  async recommendSpot(
    personaUuid: string,
    recommendedSpotUuid: string,
    uuid: string,
  ): Promise<SpotType> {
    const user = await this.userService.getUser({ uuid });

    if (user.personaUUIDs.includes(personaUuid)) {
      const userPersona = await this.personaService.getPersona({
        uuid: personaUuid,
      });

      if (!userPersona) {
        throw new Error('No persona found for given personaUuid');
      }

      userPersona.spotRecommendList = userPersona.spotRecommendList.concat(
        recommendedSpotUuid,
      );

      const recommendedSpot = await this.getSpot({
        uuid: recommendedSpotUuid,
      });

      if (!recommendedSpot) {
        throw new Error('No spot found for given recommendedSpotUuid');
      }

      recommendedSpot.networkList = recommendedSpot.networkList.concat(
        personaUuid,
      );

      await this.recommendationsService.createRecommendation({
        source: personaUuid,
        sourceKind: 'persona',
        destination: recommendedSpotUuid,
        destinationKind: 'spot',
        recommendedTill: dayjs()
          .add(2, 'week')
          .unix(),
      });

      await userPersona.save();

      return await recommendedSpot.save();
    } else {
      throw new MethodNotAllowedException(
        'User is not allowed to recommend with selected persona',
      );
    }
  }

  async saveSpot(
    spotUuid: string,
    savedSpotUuid: string,
    uuid: string,
  ): Promise<SpotType> {
    const user = await this.userService.getUser({ uuid });

    if (!user.spots.includes(spotUuid)) {
      throw new MethodNotAllowedException(
        'User is not allowed to recommend with selected spot',
      );
    }

    if (user.spots.includes(savedSpotUuid)) {
      throw new MethodNotAllowedException(
        'User is not allowed to recommend with selected spot',
      );
    }

    const userSpot = await this.getSpot({
      uuid: spotUuid,
    });

    if (!userSpot) {
      throw new Error('No spot found for given spotUuid');
    }

    userSpot.visibilityList = userSpot.visibilityList.concat(savedSpotUuid);

    const savedSpot = await this.getSpot({
      uuid: savedSpotUuid,
    });

    if (!savedSpot) {
      throw new Error('No spot found for given savedSpotUuid');
    }

    savedSpot.contactBook = savedSpot.contactBook.concat(savedSpotUuid);

    await userSpot.save();

    return await savedSpot.save();
  }

  async updateSpot(
    spot: UpdateSpotInput,
    uuid: string,
    userId: string,
  ): Promise<SpotDocument> {
    const user = await this.userService.getUser({ uuid: userId });

    if (user && user.spots.includes(uuid)) {
      return await this.mongoService.update<UpdateSpotInput, SpotDocument>(
        spot,
        {
          uuid,
        },
      );
    } else {
      throw new MethodNotAllowedException('Cannot update spot');
    }
  }

  async getSpot(condition: SpotInput): Promise<PartialSpotDocument> {
    return await this.mongoService.findByMatch<SpotInput, PartialSpotDocument>({
      isActive: true,
      ...condition,
    });
  }

  async getSpotsByIds(spotIds: string[]): Promise<SpotDocument[]> {
    const model = this.mongoService.getModel();
    return await model
      .find({
        uuid: {
          $in: spotIds,
        },
      })
      .exec();
  }

  async getUserSpots(uuid: string): Promise<SpotDocument[]> {
    const { spots } = await this.userService.getUser({ uuid });

    return spots.length > 0
      ? this.spotModel.find({
          uuid: {
            $in: spots,
          },
          isActive: true,
        })
      : [];
  }
}
