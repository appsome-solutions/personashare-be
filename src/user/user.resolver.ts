import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserType } from './dto/user.dto';
import { GqlAuthGuard } from '../auth';
import { CreateUserInput, UserInput } from './inputs';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserType)
  @UseGuards(GqlAuthGuard)
  async createUser(@Args('user') user: CreateUserInput): Promise<UserType> {
    return await this.userService.createUser(user);
  }

  @Query(() => [UserType])
  async getUser(@Args('condition') user: UserInput): Promise<UserType[]> {
    return await this.userService.findByMatch(user);
  }
}
