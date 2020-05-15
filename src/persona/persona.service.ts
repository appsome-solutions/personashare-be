import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { v4 } from 'uuid';
import dayjs from 'dayjs';

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
    persona: UpdatePersonaInput,
    uuid: string,
    userId: string,
  ): Promise<PersonaDocument> {
    const user = await this.userService.getUser({ uuid: userId });

    if (user && user.personaUUIDs.includes(uuid)) {
      return await this.mongoService.update<
        UpdatePersonaInput,
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

  async getPersonasByIds(personasIds: string[]): Promise<PersonaDocument[]> {
    const model = this.mongoService.getModel();
    return await model
      .find({
        uuid: {
          $in: personasIds,
        },
      })
      .exec();
  }

  async getUserPersonas(uuid: string): Promise<PersonaDocument[]> {
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
    personaUuid: string,
    recommendedPersonaUuid: string,
    uuid: string,
  ): Promise<PersonaDocument> {
    const user = await this.userService.getUser({ uuid });

    if (!user.personaUUIDs.includes(personaUuid)) {
      throw new MethodNotAllowedException(
        'User is not allowed to recommend with selected persona',
      );
    }

    if (user.personaUUIDs.includes(recommendedPersonaUuid)) {
      throw new MethodNotAllowedException(
        'User is not allowed to recommend with selected persona',
      );
    }

    const userPersona = await this.getPersona({
      uuid: personaUuid,
    });

    if (!userPersona) {
      throw new Error('No persona found for given personaUuid');
    }

    userPersona.recommendList = userPersona.recommendList.concat(
      recommendedPersonaUuid,
    );

    const recommendedPersona = await this.getPersona({
      uuid: recommendedPersonaUuid,
    });

    if (!recommendedPersona) {
      throw new Error('No persona found for given recommendedPersonaUuid');
    }

    recommendedPersona.networkList = recommendedPersona.networkList.concat(
      personaUuid,
    );

    await this.recommendationsService.createRecommendation({
      source: personaUuid,
      sourceKind: 'persona',
      destination: recommendedPersonaUuid,
      destinationKind: 'persona',
      recommendedTill: dayjs()
        .add(2, 'week')
        .unix(),
    });

    await userPersona.save();

    return await recommendedPersona.save();
  }

  async saveSpotForPersona(
    personaUuid: string,
    savedSpotUuid: string,
    uuid: string,
  ): Promise<PartialPersonaDocument> {
    const user = await this.userService.getUser({ uuid });

    if (!user.personaUUIDs.includes(personaUuid)) {
      throw new MethodNotAllowedException(
        'User is not allowed to recommend with selected persona',
      );
    }

    if (user.spots.includes(savedSpotUuid)) {
      throw new MethodNotAllowedException(
        'User is not allowed to recommend with selected spot',
      );
    }

    const userPersona = await this.getPersona({
      uuid: personaUuid,
    });

    if (!userPersona) {
      throw new Error('No persona found for given personaUuid');
    }

    userPersona.spotVisibilityList = userPersona.spotVisibilityList.concat(
      savedSpotUuid,
    );

    const savedPersona = await this.getPersona({
      uuid: savedSpotUuid,
    });

    if (!savedPersona) {
      throw new Error('No persona found for given savedPersonaUuid');
    }

    savedPersona.contactBook = savedPersona.contactBook.concat(personaUuid);

    await userPersona.save();

    return await savedPersona.save();
  }

  async savePersona(
    personaUuid: string,
    savedPersonaUuid: string,
    uuid: string,
  ): Promise<PersonaDocument> {
    const user = await this.userService.getUser({ uuid });

    if (!user.personaUUIDs.includes(personaUuid)) {
      throw new MethodNotAllowedException(
        'User is not allowed to recommend with selected persona',
      );
    }

    if (user.personaUUIDs.includes(savedPersonaUuid)) {
      throw new MethodNotAllowedException(
        'User is not allowed to recommend with selected persona',
      );
    }

    const userPersona = await this.getPersona({
      uuid: personaUuid,
    });

    if (!userPersona) {
      throw new Error('No persona found for given personaUuid');
    }

    userPersona.visibilityList = userPersona.visibilityList.concat(
      savedPersonaUuid,
    );

    const savedPersona = await this.getPersona({
      uuid: savedPersonaUuid,
    });

    if (!savedPersona) {
      throw new Error('No persona found for given savedPersonaUuid');
    }

    savedPersona.contactBook = savedPersona.contactBook.concat(personaUuid);

    await userPersona.save();

    return await savedPersona.save();
  }
}
