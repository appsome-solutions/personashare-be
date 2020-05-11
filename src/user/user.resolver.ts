import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserType, UserLoginType } from './dto';
import { UpdateUserInput, UserInput } from './inputs';
import { GqlUserGuard } from '../guards';
import { GQLContext } from '../app.interfaces';
import { FirebaseService } from '../firebase';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Query(() => UserType, { nullable: true })
  @UseGuards(GqlUserGuard)
  async user(@Context() context: GQLContext): Promise<UserType> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.userService.getUser({
      uuid: uid,
    });
  }

  @Mutation(() => UserLoginType)
  async loginUser(@Args('idToken') idToken: string): Promise<UserLoginType> {
    return await this.userService.loginUser(idToken);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlUserGuard)
  async logout(@Context() context: GQLContext): Promise<boolean> {
    const { uid } = await this.firebaseService.getClaimFromToken(context);

    return await this.userService.logoutUser(uid);
  }

  @Mutation(() => UserType)
  @UseGuards(GqlUserGuard)
  async updateUser(
    @Args('user') user: UpdateUserInput,
    @Args('uuid') uuid: string,
  ): Promise<UserType> {
    return await this.userService.updateUser(user, uuid);
  }

  @Mutation(() => Number)
  @UseGuards(GqlUserGuard)
  async removeUser(@Args('condition') condition: UserInput): Promise<number> {
    return await this.userService.removeUser(condition);
  }
}
