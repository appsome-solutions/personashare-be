import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { v4 } from 'uuid';
import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

import { MongoService } from '../mongo-service/mongo.service';
import {
  ConnectPersonaInput,
  connectPersona,
  UpdatePersonaInput,
} from '../shared';
import { AddPersonaInput } from '../user/inputs';
import { UserDocument } from '../user/interfaces/user.interfaces';
import { ConfigService } from '../config';
import { QrCodeService } from '../qrcode';
import { UserService } from '../user';
import { RecommendationsService } from '../recommendations';

import {
  PartialPersonaDocument,
  PersonaDocument,
  PersonaInterface,
} from './interfaces/persona.interfaces';
import { PersonaInput } from './input';
import { RemoveEntityInput } from '../shared/input/remove-entity.input';
import { FeatureKindService } from '../feature-kind';

@Injectable()
export class PersonaService {
  mongoService: MongoService<Model<PersonaDocument>>;

  constructor(
    @InjectModel('Persona')
    private readonly personaModel: Model<PersonaDocument>,
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
    private readonly qrCodeService: QrCodeService,
    private readonly userService: UserService,
    private readonly recommendationsService: RecommendationsService,
    private readonly featureKindService: FeatureKindService,
  ) {
    this.mongoService = new MongoService(this.personaModel);
  }

  async createPersona(input: AddPersonaInput): Promise<PersonaDocument> {
    // TODO: will be change to the domain
    const { baseUrl, applicationPort } = this.configService;
    const { persona, uuid } = input;
    const personaUuid = v4();

    const url = `${baseUrl}:${applicationPort}/persona/${personaUuid}`;
    const assetPath = `qrcodes/persona_${personaUuid}.svg`;
    const qrCodeLink = await this.qrCodeService.uploadQrCodeWithLogo(
      assetPath,
      url,
    );

    const personaDoc: PersonaInterface = {
      ...persona,
      userId: uuid,
      uuid: personaUuid,
      personaUUIDs: [],
      networkList: [],
      recommendList: [],
      spotNetworkList: [],
      spotRecommendList: [],
      contactBook: [],
      spotBook: [],
      visibilityList: [],
      spotVisibilityList: [],
      isActive: true,
      createdAt: dayjs.utc().unix(),
      qrCodeLink,
    };

    const newPersona = await this.mongoService.create<
      PersonaInterface,
      PersonaDocument
    >(personaDoc);

    const connectPersonaPayload: ConnectPersonaInput = {
      personaUUID: newPersona.uuid,
      uuid,
    };

    const user = await connectPersona<UserDocument>(
      connectPersonaPayload,
      this.userModel,
    );

    if (user.personaUUIDs && user.personaUUIDs.length === 1) {
      user.defaultPersona = newPersona.uuid;
    }

    await user.save();

    return newPersona;
  }

  async setDefaultPersona(
    personaUuid: string,
    userId: string,
  ): Promise<PersonaDocument> {
    const persona = this.getPersona({ uuid: personaUuid });
    const user = await this.userService.getUser({ uuid: userId });

    if (user.personaUUIDs && user.personaUUIDs.includes(personaUuid)) {
      user.defaultPersona = personaUuid;

      await user.save();
    } else {
      throw new MethodNotAllowedException('Cannot set persona as default');
    }

    return persona;
  }

  async updatePersona(
    persona: UpdatePersonaInput | RemoveEntityInput,
    uuid: string,
    userId: string,
  ): Promise<PersonaDocument> {
    const user = await this.userService.getUser({ uuid: userId });

    if (user && user.personaUUIDs.includes(uuid)) {
      return await this.mongoService.update<
        UpdatePersonaInput | RemoveEntityInput,
        PersonaDocument
      >(persona, {
        uuid,
      });
    } else {
      throw new MethodNotAllowedException('Cannot update persona');
    }
  }

  async getPersona(condition: PersonaInput): Promise<PartialPersonaDocument> {
    return await this.mongoService.findByMatch<
      PersonaInput,
      PartialPersonaDocument
    >({
      isActive: true,
      ...condition,
    });
  }

  async getPersonasByIds(
    personasIds: string[],
  ): Promise<PartialPersonaDocument[]> {
    const model = this.mongoService.getModel();
    return await model
      .find({
        uuid: {
          $in: personasIds,
        },
      })
      .exec();
  }

  async getUserPersonas(uuid: string): Promise<PartialPersonaDocument[]> {
    const { personaUUIDs } = await this.userService.getUser({ uuid });

    return personaUUIDs.length > 0
      ? this.personaModel.find({
          uuid: {
            $in: personaUUIDs,
          },
          isActive: true,
        })
      : [];
  }

  async connectPersona(payload: ConnectPersonaInput): Promise<PersonaDocument> {
    const persona = await connectPersona(payload, this.personaModel);
    return await persona.save();
  }

  async recommendPersona(
    recommendedPersonaUuid: string,
    uuid: string,
  ): Promise<PersonaDocument> {
    const user = await this.userService.getUser({ uuid });

    if (!user.defaultPersona) {
      throw new MethodNotAllowedException(
        'No default persona for given user. Please, create one.',
      );
    }

    if (user.personaUUIDs.includes(recommendedPersonaUuid)) {
      throw new MethodNotAllowedException(
        'No default persona found for given user',
      );
    }

    const userPersona = await this.getPersona({
      uuid: user.defaultPersona,
    });

    if (!userPersona) {
      throw new Error('No default persona found for given user');
    }

    const featuresLimits = this.featureKindService.getPersonaFeaturesLimits(
      user.kind || 'free',
    );

    if (userPersona.recommendList.length >= featuresLimits.recommendList) {
      throw new MethodNotAllowedException(
        'You reached recommendation limit for your persona',
      );
    }

    const recommendedPersona = await this.getPersona({
      uuid: recommendedPersonaUuid,
    });

    if (!recommendedPersona) {
      throw new Error('No persona found for given recommendedPersonaUuid');
    }

    const recommendedPersonaUser = await this.userService.getUser({
      uuid: recommendedPersona.userId,
    });

    if (!recommendedPersonaUser) {
      throw new Error('No user found for recommended persona');
    }

    const recommendedUserLimits = this.featureKindService.getPersonaFeaturesLimits(
      recommendedPersonaUser.kind || 'free',
    );

    if (
      recommendedPersona.networkList.length >= recommendedUserLimits.networkList
    ) {
      throw new MethodNotAllowedException(
        'You cant recommend this persona - recommendation limits reached.',
      );
    }

    if (userPersona.recommendList.includes(recommendedPersonaUuid)) {
      throw new MethodNotAllowedException(
        'User is not allowed to recommend this persona - already recommended.',
      );
    }

    if (recommendedPersona.networkList.includes(user.defaultPersona)) {
      throw new MethodNotAllowedException(
        'User is not allowed to recommend with selected persona - already recommended.',
      );
    }

    userPersona.recommendList = userPersona.recommendList.concat(
      recommendedPersonaUuid,
    );

    recommendedPersona.networkList = recommendedPersona.networkList.concat(
      user.defaultPersona,
    );

    await this.recommendationsService.createRecommendation({
      source: user.defaultPersona,
      sourceKind: 'persona',
      destination: recommendedPersonaUuid,
      destinationKind: 'persona',
      recommendedTill: dayjs
        .utc()
        .add(2, 'week')
        .unix(),
    });

    await userPersona.save();

    return await recommendedPersona.save();
  }

  async savePersona(
    savedPersonaUuid: string,
    uuid: string,
  ): Promise<PersonaDocument> {
    const user = await this.userService.getUser({ uuid });

    if (user.personaUUIDs.includes(savedPersonaUuid)) {
      throw new MethodNotAllowedException(
        'User is not allowed to save persona with selected persona',
      );
    }

    if (!user.defaultPersona) {
      throw new MethodNotAllowedException(
        'No default persona for given user. Please, create one.',
      );
    }

    const defaultPersona = await this.getPersona({
      uuid: user.defaultPersona,
    });

    if (!defaultPersona) {
      throw new MethodNotAllowedException(
        'No default persona for given user. Please, create one.',
      );
    }

    const savedPersona = await this.getPersona({
      uuid: savedPersonaUuid,
    });

    if (!savedPersona) {
      throw new Error('No persona found for given savedPersonaUuid');
    }

    if (savedPersona.visibilityList.includes(user.defaultPersona)) {
      throw new MethodNotAllowedException('Persona already saved!');
    }

    if (defaultPersona.contactBook.includes(savedPersonaUuid)) {
      throw new MethodNotAllowedException('Persona already saved!');
    }

    savedPersona.visibilityList = savedPersona.visibilityList.concat(
      user.defaultPersona,
    );

    defaultPersona.contactBook = defaultPersona.contactBook.concat(
      savedPersonaUuid,
    );

    await defaultPersona.save();

    return await savedPersona.save();
  }
}
