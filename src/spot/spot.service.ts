import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  EmailInvitation,
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
import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { RemoveEntityInput } from '../shared/input/remove-entity.input';
import { FeatureKindService } from '../feature-kind';

type LimitationsType = {
  canPersonaParticipate: boolean;
  canBeRecommended: boolean;
};

@Injectable()
export class SpotService {
  mongoService: MongoService<Model<SpotDocument>>;
  dayjs = dayjs.extend(utc);

  constructor(
    @InjectModel('Spot')
    private readonly spotModel: Model<SpotDocument>,
    private readonly configService: ConfigService,
    private readonly qrCodeService: QrCodeService,
    private readonly userService: UserService,
    private readonly personaService: PersonaService,
    private readonly recommendationsService: RecommendationsService,
    private readonly featureKindService: FeatureKindService,
  ) {
    this.mongoService = new MongoService(this.spotModel);
  }

  async createSpot(uid: string, spot: SpotInterface): Promise<SpotDocument> {
    // TODO: will be change to the domain
    const { baseUrl } = this.configService;
    const { uuid } = spot;

    const user = await this.userService.getUser({ uuid: uid });

    if (!user.defaultPersona) {
      throw new Error('No default persona found for given user');
    }

    const url = `${baseUrl}/spot/${uuid}`;
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

    const spotUser = await this.userService.getUser({
      uuid: spot.userId,
    });

    if (!spotUser) {
      throw new Error('No user found for given spot');
    }

    const featureLimits = this.featureKindService.getSpotFeaturesLimits(
      spotUser.kind || 'free',
    );

    if (spot.participants.length >= featureLimits.participants) {
      throw new MethodNotAllowedException('Limit for participation reached');
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

    if (!user) {
      throw new Error('No user found for given id');
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

    const userSpot = await this.userService.getUser({
      uuid: spot.userId,
    });

    if (!userSpot) {
      throw new Error('No user found for given spot');
    }

    const featureLimits = this.featureKindService.getSpotFeaturesLimits(
      userSpot.kind || 'free',
    );

    if (spot.managers.length >= featureLimits.managers) {
      throw new MethodNotAllowedException(
        'Cannot add manager to the given spot - limit reached',
      );
    }

    const userOnTheList = (spot.invitedManagerEmails as EmailInvitation[]).find(
      invitation => {
        return (
          invitation.email === user.email && invitation.status === 'pending'
        );
      },
    );

    if (!userOnTheList) {
      throw new MethodNotAllowedException(
        'Cannot add manager to the given spot.',
      );
    }

    if (!spot.managers.includes(persona.uuid)) {
      spot.managers = spot.managers.concat(personaId);
      spot.invitedManagerEmails = (spot.invitedManagerEmails as EmailInvitation[]).map(
        invitation => {
          if (invitation.email === user.email) {
            return {
              ...invitation,
              status: 'success',
            };
          }
          return invitation;
        },
      );

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

    const featuresLimits = this.featureKindService.getPersonaFeaturesLimits(
      user.kind || 'free',
    );

    if (
      userPersona.spotRecommendList.length >= featuresLimits.spotRecommendList
    ) {
      throw new MethodNotAllowedException(
        'You reached recommendation limit for your persona',
      );
    }

    const recommendedSpot = await this.getSpot({
      uuid: recommendedSpotUuid,
    });

    if (!recommendedSpot) {
      throw new Error('No spot found for given recommendedSpotUuid');
    }

    const recommendedSpotUser = await this.userService.getUser({
      uuid: recommendedSpot.userId,
    });

    if (!recommendedSpotUser) {
      throw new Error('No user found for recommended spot');
    }

    const recommendedUserLimits = this.featureKindService.getSpotFeaturesLimits(
      recommendedSpotUser.kind || 'free',
    );

    if (
      recommendedSpot.networkList.length >= recommendedUserLimits.networkList
    ) {
      throw new MethodNotAllowedException(
        'You cant recommend this spot - recommendation limits reached.',
      );
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
      recommendedTill: this.dayjs
        .utc()
        .add(4, 'week')
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

  getSpotLimitations = async (
    spot: PartialSpotDocument | SpotDocument,
  ): Promise<LimitationsType> => {
    if (!spot || !spot.userId) {
      return Promise.resolve({
        canBeRecommended: false,
        canPersonaParticipate: false,
      });
    }

    const spotUser = await this.userService.getUser({
      uuid: spot.userId,
    });

    if (!spotUser) {
      throw new Error('No user found for given spot');
    }

    const userSpotLimits = this.featureKindService.getSpotFeaturesLimits(
      spotUser.kind || 'free',
    );
    const limitations = {} as LimitationsType;

    if (spot.participants.length >= userSpotLimits.participants) {
      limitations.canPersonaParticipate = false;
    }
    limitations.canPersonaParticipate = true;

    const userPersonaLimits = this.featureKindService.getPersonaFeaturesLimits(
      spotUser.kind || 'free',
    );

    const spotOwnerPersona = await this.personaService.getPersona({
      uuid: spot.owner,
    });

    if (
      spotOwnerPersona.spotRecommendList.length >=
      userPersonaLimits.spotRecommendList
    ) {
      limitations.canBeRecommended = false;
    }
    limitations.canBeRecommended = true;

    return Promise.resolve(limitations);
  };

  async getSpot(condition: SpotInput): Promise<PartialSpotDocument> {
    const spot = await this.mongoService.findByMatch<
      SpotInput,
      PartialSpotDocument
    >({
      isActive: true,
      ...condition,
    });

    if (spot) {
      const limitations = await this.getSpotLimitations(spot);

      spot.canBeRecommended = limitations.canBeRecommended;
      spot.canPersonaParticipate = limitations.canPersonaParticipate;
    }

    return spot;
  }

  async getSpotsByIds(spotIds: string[]): Promise<PartialSpotDocument[]> {
    const model = this.mongoService.getModel();

    const spots = (await model
      .find({
        uuid: {
          $in: spotIds,
        },
      })
      .exec()) as Array<PartialSpotDocument>;

    spots.map(async spot => {
      const limitations = await this.getSpotLimitations(spot);

      spot.canBeRecommended = limitations.canBeRecommended;
      spot.canPersonaParticipate = limitations.canPersonaParticipate;
    });

    return spots;
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
