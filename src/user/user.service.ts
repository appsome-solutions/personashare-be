import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import { UserDocument, UserInterface } from './interfaces/user.interfaces';
import { UpdateUserInput, UserInput } from './inputs';
import { UserLoginType } from './dto';
import { MongoService } from '../mongo-service/mongo.service';
import { FirebaseService } from '../firebase';
import { MailchimpService } from '../mailchimp';

@Injectable()
export class UserService {
  mongoService: MongoService<Model<UserDocument>>;

  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private readonly firebaseService: FirebaseService,
    private readonly mailchimpService: MailchimpService,
  ) {
    this.mongoService = new MongoService(this.userModel);
  }

  async createUser(user: UserInterface): Promise<UserDocument> {
    try {
      await this.mailchimpService.subscribe(user.email);
    } catch (_e) {
      console.log(_e);
    }

    return await this.mongoService.create<UserInterface, UserDocument>(user);
  }

  async loginUser(idToken: string): Promise<UserLoginType> {
    const userData = await this.firebaseService.getDecodedClaim(idToken);
    const { uid, email, name, picture } = userData;

    let user = await this.getUser({ uuid: uid });

    if (!user) {
      user = await this.createUser({
        uuid: uid,
        email,
        name,
        photo: picture,
        defaultPersona: '',
        personaUUIDs: [],
        spots: [],
        lastIdToken: idToken,
      });
    }

    return {
      user,
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
}
