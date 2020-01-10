import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { UserDocument, UserInterface } from './interfaces/user.interfaces';
import {
  RemovePersonaInput,
  UpdateUserInput,
  UserInput,
  AddPersonaInput,
} from './inputs';
import { UserType, UserLoginType } from './dto';
import { MongoService } from '../mongo-service/mongo.service';
import { FirebaseService } from '../firebase';
import { AuthService } from '../auth';
import { PersonaInterface, PersonaService, PersonaDocument } from '../persona';
import {
  connectPersona,
  ConnectPersonaInput,
  disconnectPersona,
} from '../shared';

@Injectable()
export class UserService {
  mongoService: MongoService<Model<UserDocument>>;

  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private readonly firebaseService: FirebaseService,
    private readonly authService: AuthService,
    private readonly personaService: PersonaService,
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

    if (user) {
      await this.createUser({
        uuid: uid,
        email,
        name,
        photo: picture,
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

  async getUser(condition: UserInput): Promise<UserType> {
    return await this.mongoService.findByMatch<UserInput, UserType>(condition);
  }

  async createPersona(input: AddPersonaInput): Promise<PersonaDocument> {
    const { persona, uuid } = input;
    const personaDoc: PersonaInterface = {
      ...persona,
      uuid: v4(),
    };

    const newPersona = await this.personaService.createPersona(personaDoc);
    const connectPersonaPayload: ConnectPersonaInput = {
      personaUUID: newPersona.uuid,
      uuid,
    };

    await connectPersona<UserDocument>(connectPersonaPayload, this.userModel);

    return newPersona;
  }

  async removePersona(condition: RemovePersonaInput): Promise<number> {
    await disconnectPersona<UserDocument>(condition, this.userModel);

    return await this.personaService.removePersona({
      uuid: condition.personaUUID,
    });
  }
}
