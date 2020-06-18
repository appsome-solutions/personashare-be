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
import { PartialPersonaDocument, PersonaService } from '../persona';
import { RecommendationsService } from '../recommendations';
import dayjs from 'dayjs';
import { RemoveEntityInput } from '../shared/input/remove-entity.input';

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

  async createSpot(uid: string, spot: SpotInterface): Promise<SpotDocument> {
    // TODO: will be change to the domain
    const { baseUrl, applicationPort } = this.configService;
    const { uuid } = spot;

    const user = await this.userService.getUser({ uuid: uid });

    if (!user.defaultPersona) {
      throw new Error('No default persona found for given user');
    }

    const url = `${baseUrl}:${applicationPort}/persona/${uuid}`;
    const assetPath = `qrcodes/spot_${uuid}.svg`;

    const qrCodeLink = await this.qrCodeService.uploadQrCodeWithLogo(
      assetPath,
      url,
    );

    const spotDoc: SpotInterface = {
      ...spot,
      owner: user.defaultPersona,
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
  ): Promise<PartialSpotDocument> {
    const user = await this.userService.getUser({
      uuid,
    });

    if (!user.defaultPersona) {
      throw new MethodNotAllowedException(
        'No default persona found. Please, create one.',
      );
    }

    const persona = await this.personaService.getPersona({
      uuid: user.defaultPersona,
    });

    if (!persona) {
      throw new MethodNotAllowedException(
        'No default persona found. Please, create one.',
      );
    }

    const spot = await this.getSpot({
      uuid: spotId,
    });

    if (!spot) {
      throw new MethodNotAllowedException('No spot found for given id');
    }

    if (!spot.participants.includes(persona.uuid)) {
      spot.participants = spot.participants.concat(persona.uuid);

      await spot.save();
    } else {
      throw new MethodNotAllowedException(
        'Persona already participates in given spot',
      );
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
    recommendedSpotUuid: string,
    uuid: string,
  ): Promise<SpotType> {
    const user = await this.userService.getUser({ uuid });

    if (!user.defaultPersona) {
      throw new MethodNotAllowedException(
        'No default persona for given user. Please, create one.',
      );
    }

    const userPersona = await this.personaService.getPersona({
      uuid: user.defaultPersona,
    });

    if (!userPersona) {
      throw new Error('No default persona found for given user');
    }

    const recommendedSpot = await this.getSpot({
      uuid: recommendedSpotUuid,
    });

    if (!recommendedSpot) {
      throw new Error('No spot found for given recommendedSpotUuid');
    }

    if (userPersona.spotRecommendList.includes(recommendedSpotUuid)) {
      throw new MethodNotAllowedException(
        'User is not allowed to recommend selected spot - already recommended.',
      );
    }

    if (recommendedSpot.networkList.includes(user.defaultPersona)) {
      throw new MethodNotAllowedException(
        'User is not allowed to recommend with selected persona - already recommended.',
      );
    }

    userPersona.spotRecommendList = userPersona.spotRecommendList.concat(
      recommendedSpotUuid,
    );

    recommendedSpot.networkList = recommendedSpot.networkList.concat(
      user.defaultPersona,
    );

    await this.recommendationsService.createRecommendation({
      source: user.defaultPersona,
      sourceKind: 'persona',
      destination: recommendedSpotUuid,
      destinationKind: 'spot',
      recommendedTill: dayjs()
        .add(2, 'week')
        .unix(),
    });

    await userPersona.save();

    return await recommendedSpot.save();
  }

  async saveSpot(
    savedSpotUuid: string,
    uuid: string,
  ): Promise<PartialPersonaDocument> {
    const user = await this.userService.getUser({ uuid });

    if (user.spots.includes(savedSpotUuid)) {
      throw new MethodNotAllowedException(
        'User is not allowed to save spot with selected spot',
      );
    }

    const savedSpot = await this.getSpot({
      uuid: savedSpotUuid,
    });

    if (!savedSpot) {
      throw new Error('No spot found for given savedSpotUuid');
    }

    if (!user.defaultPersona) {
      throw new MethodNotAllowedException(
        'No default persona for given user. Please, create one.',
      );
    }

    const defaultPersona = await this.personaService.getPersona({
      uuid: user.defaultPersona,
    });

    if (!defaultPersona) {
      throw new MethodNotAllowedException(
        'No default persona for given user. Please, create one.',
      );
    }

    if (savedSpot.visibilityList.includes(user.defaultPersona)) {
      throw new MethodNotAllowedException('Spot already saved!');
    }

    if (defaultPersona.spotBook.includes(savedSpotUuid)) {
      throw new MethodNotAllowedException('Spot already saved!');
    }

    savedSpot.visibilityList = savedSpot.visibilityList.concat(
      user.defaultPersona,
    );

    defaultPersona.spotBook = defaultPersona.spotBook.concat(savedSpotUuid);

    await savedSpot.save();

    return await defaultPersona.save();
  }

  async updateSpot(
    spot: UpdateSpotInput | RemoveEntityInput,
    uuid: string,
    userId: string,
  ): Promise<SpotDocument> {
    const user = await this.userService.getUser({ uuid: userId });

    if (user && user.spots.includes(uuid)) {
      return await this.mongoService.update<
        UpdateSpotInput | RemoveEntityInput,
        SpotDocument
      >(spot, {
        uuid,
      });
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

  async getSpotsByIds(spotIds: string[]): Promise<PartialSpotDocument[]> {
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
