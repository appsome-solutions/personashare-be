import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserType, UserLoginType } from './dto';
import {
  CreateUserInput,
  RemovePersonaInput,
  UpdateUserInput,
  UserInput,
  AddPersonaInput,
} from './inputs';
import { GqlSessionGuard } from '../guards';
import { PersonaType } from '../persona';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserType])
  async getUser(@Args('condition') condition: UserInput): Promise<UserType[]> {
    return await this.userService.getUser(condition);
  }

  @Mutation(() => UserLoginType)
  async loginUser(@Args('idToken') idToken: string): Promise<UserLoginType> {
    return await this.userService.loginUser(idToken);
  }

  @Mutation(() => String)
  async logoutUser(@Args('uid') uid: string): Promise<boolean> {
    return await this.userService.logoutUser(uid);
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

  @Mutation(() => PersonaType)
  @UseGuards(GqlSessionGuard)
  async createPersona(
    @Args('input') input: AddPersonaInput,
  ): Promise<UserType> {
    return await this.userService.createPersona(input);
  }

  @Mutation(() => Number)
  @UseGuards(GqlSessionGuard)
  async removePersona(
    @Args('payload') payload: RemovePersonaInput,
  ): Promise<number> {
    return await this.userService.removePersona(payload);
  }
}
