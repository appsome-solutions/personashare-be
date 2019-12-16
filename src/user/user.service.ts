import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { UserDocument, UserInterface } from './interfaces/user.interfaces';
import { UpdateUserInput, UserInput, LoginUserInput } from './inputs';
import { UserType } from './dto/user.dto';
import { MongoService } from '../mongo-service/mongo.service';
import { FirebaseService } from '../firebase';

@Injectable()
export class UserService {
  mongoService: MongoService<Model<UserDocument>>;

  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private readonly firebaseService: FirebaseService,
  ) {
    this.mongoService = new MongoService(this.userModel);
  }

  async createUser(user: UserInterface): Promise<UserDocument> {
    return await this.mongoService.create<UserInterface, UserDocument>(user);
  }

  async loginUser(user: LoginUserInput): Promise<boolean> {
    const { idToken, csrfToken } = user;
    return !!idToken && !!csrfToken;
  }

  async removeUser(condition: UserInput): Promise<number> {
    const user = await this.getUser(condition);

    if (user.length) {
      const result = await this.mongoService.remove<UserInput>(condition);

      if (result) {
        await this.firebaseService.removeUser(user[0].uuid);
      }

      return result;
    }

    return 0;
  }

  async getUser(condition: UserInput): Promise<UserType[]> {
    return await this.mongoService.findByMatch<UserInput, UserType>(condition);
  }

  async updateUser(user: UpdateUserInput, uuid: string): Promise<UserDocument> {
    return await this.mongoService.update<UpdateUserInput, UserDocument>(
      user,
      uuid,
    );
  }
}
