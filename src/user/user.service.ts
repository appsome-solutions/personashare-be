import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { UserDocument, UserInterface } from './interfaces/user.interfaces';
import { CreateUserInput, UserInput } from './inputs';
import { UserType } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(user: CreateUserInput): Promise<UserDocument> {
    const userDoc: UserInterface = {
      ...user,
      uuid: user.uuid || v4(),
    };
    const newUser = new this.userModel(userDoc);

    return await newUser.save();
  }

  async findByMatch(condition: UserInput): Promise<UserType[]> {
    const users = await this.userModel.find(condition).exec();

    return !users || users.length < 1 ? [] : users;
  }
}
