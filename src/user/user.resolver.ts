import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserType } from './dto/user.dto';
import { GqlAuthGuard } from '../auth';
import { CreateUserInput, UpdateUserInput, UserInput } from './inputs';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserType])
  async getUser(@Args('condition') condition: UserInput): Promise<UserType[]> {
    return await this.userService.getUser(condition);
  }

  @Mutation(() => UserType)
  @UseGuards(GqlAuthGuard)
  async createUser(@Args('user') user: CreateUserInput): Promise<UserType> {
    return await this.userService.createUser(user);
  }

  @Mutation(() => UserType)
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @Args('user') user: UpdateUserInput,
    @Args('uuid') uuid: string,
  ): Promise<UserType> {
    return await this.userService.update(user, uuid);
  }

  @Mutation(() => Number)
  @UseGuards(GqlAuthGuard)
  async removeUser(@Args('condition') condition: UserInput): Promise<number> {
    return await this.userService.remove(condition);
  }
}
