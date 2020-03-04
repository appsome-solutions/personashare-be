import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { v4 } from 'uuid';
import { UserDocument, UserInterface } from './interfaces/user.interfaces';
import {
  RemovePersonaInput,
  UpdateUserInput,
  UserInput,
  AddPersonaInput,
} from './inputs';
import { UserLoginType } from './dto';
import { MongoService } from '../mongo-service/mongo.service';
import { FirebaseService } from '../firebase';
import { AuthService } from '../auth';
import {
  PersonaInterface,
  PersonaService,
  PersonaDocument,
  PersonaType,
} from '../persona';
import {
  connectPersona,
  ConnectPersonaInput,
  disconnectPersona,
} from '../shared';
import { QrCodeService } from '../qrcode';
import { ConfigService } from '../config';

@Injectable()
export class UserService {
  mongoService: MongoService<Model<UserDocument>>;

  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private readonly firebaseService: FirebaseService,
    private readonly authService: AuthService,
    private readonly personaService: PersonaService,
    private readonly qrCodeService: QrCodeService,
    private readonly configService: ConfigService,
  ) {
    this.mongoService = new MongoService(this.userModel);
  }

  async createUser(user: UserInterface): Promise<UserDocument> {
    return await this.mongoService.create<UserInterface, UserDocument>(user);
  }

  async loginUser(idToken: string): Promise<UserLoginType> {
    const userData = await this.firebaseService.getDecodedClaim(idToken);
    const { uid, email, name, picture } = userData;

    const user = await this.getUser({ uuid: uid });

    if (!user) {
      await this.createUser({
        uuid: uid,
        email,
        name,
        photo: picture,
        defaultPersona: '',
      });
    }

    const accessToken = await this.authService.createSessionCookie(idToken);

    return {
      accessToken,
    };
  }

  async logoutUser(uid: string): Promise<boolean> {
    await this.firebaseService.revokeRefreshTokens(uid);

    return true;
  }

  async removeUser(condition: UserInput): Promise<number> {
    const user = await this.getUser(condition);

    if (user) {
      const result = await this.mongoService.remove<UserInput>(condition);

      if (result) {
        await this.firebaseService.removeUser(user.uuid);
      }

      return result;
    }

    return 0;
  }

  async updateUser(user: UpdateUserInput, uuid: string): Promise<UserDocument> {
    return await this.mongoService.update<UpdateUserInput, UserDocument>(user, {
      uuid,
    });
  }

  async getUser(condition: UserInput): Promise<UserDocument> {
    return await this.mongoService.findByMatch<UserInput, UserDocument>(
      condition,
    );
  }

  async createPersona(input: AddPersonaInput): Promise<PersonaDocument> {
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
      qrCodeLink,
    };

    const newPersona = await this.personaService.createPersona(personaDoc);
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

  async removePersona(condition: RemovePersonaInput): Promise<number> {
    // TODO: add checking that persona is default for the user
    await disconnectPersona<UserDocument>(condition, this.userModel);

    return await this.personaService.removePersona({
      uuid: condition.personaUUID,
    });
  }

  async setDefaultPersona(
    personaUuid: string,
    userId: string,
  ): Promise<PersonaType> {
    const persona = this.personaService.getPersona({ uuid: personaUuid });
    const user = await this.getUser({ uuid: userId });

    if (user.personaUUIDs && user.personaUUIDs.includes(personaUuid)) {
      user.defaultPersona = personaUuid;

      await user.save();
    } else {
      throw new MethodNotAllowedException('Cannot set persona as default');
    }

    return persona;
  }
}
