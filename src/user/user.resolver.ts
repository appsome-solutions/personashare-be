import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserType } from './dto/user.dto';
import {
  CreateUserInput,
  UpdateUserInput,
  UserInput,
  LoginUserInput,
} from './inputs';
import { GqlCSRFGuard, GqlSessionGuard } from '../guards';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserType])
  async getUser(@Args('condition') condition: UserInput): Promise<UserType[]> {
    return await this.userService.getUser(condition);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlCSRFGuard)
  async loginUser(@Args('user') user: LoginUserInput): Promise<boolean> {
    return await this.userService.loginUser(user);
  }

  @Mutation(() => UserType)
  @UseGuards(GqlSessionGuard)
  async createUser(@Args('user') user: CreateUserInput): Promise<UserType> {
    return await this.userService.createUser(user);
  }

  @Mutation(() => UserType)
  @UseGuards(GqlSessionGuard)
  async updateUser(
    @Args('user') user: UpdateUserInput,
    @Args('uuid') uuid: string,
  ): Promise<UserType> {
    return await this.userService.updateUser(user, uuid);
  }

  @Mutation(() => Number)
  @UseGuards(GqlSessionGuard)
  async removeUser(@Args('condition') condition: UserInput): Promise<number> {
    return await this.userService.removeUser(condition);
  }
}
