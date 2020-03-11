import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
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
import { CreatePersonaInput, PersonaType } from '../persona';
import { GQLContext } from '../app.interfaces';
import { FirebaseService } from '../firebase';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Query(() => UserType, { nullable: true })
  async user(@Args('condition') condition: UserInput): Promise<UserType> {
    return await this.userService.getUser(condition);
  }

  @Mutation(() => UserLoginType)
  async loginUser(@Args('idToken') idToken: string): Promise<UserLoginType> {
    return await this.userService.loginUser(idToken);
  }

  @Mutation(() => Boolean)
  async logout(@Context() context: GQLContext): Promise<boolean> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);
    return await this.userService.logoutUser(uid);
  }

  @Mutation(() => UserType)
  @UseGuards(GqlSessionGuard)
  async createUser(@Args('user') user: CreateUserInput): Promise<UserType> {
    return await this.userService.createUser({
      ...user,
      defaultPersona: '',
      personaUUIDs: [],
    });
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
    @Args('persona') persona: CreatePersonaInput,
    @Context() context: GQLContext,
  ): Promise<PersonaType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);
    const payload: AddPersonaInput = {
      uuid: uid,
      persona,
    };

    return await this.userService.createPersona(payload);
  }

  @Mutation(() => Number)
  @UseGuards(GqlSessionGuard)
  async removePersona(
    @Args('payload') payload: RemovePersonaInput,
  ): Promise<number> {
    return await this.userService.removePersona(payload);
  }

  @Mutation(() => PersonaType)
  @UseGuards(GqlSessionGuard)
  async setDefaultPersona(
    @Args('uuid') uuid: string,
    @Context() context: GQLContext,
  ): Promise<PersonaType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);
    return await this.userService.setDefaultPersona(uuid, uid);
  }

  @Mutation(() => PersonaType)
  @UseGuards(GqlSessionGuard)
  async recommendBy(
    @Args('personaUuid') personaUuid: string,
    @Args('recommendedPersonaUuid') recommendedPersonaUuid: string,
    @Context() context: GQLContext,
  ): Promise<PersonaType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.userService.recommendPersona(
      personaUuid,
      recommendedPersonaUuid,
      uid,
    );
  }
}
