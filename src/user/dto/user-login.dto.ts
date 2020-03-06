import { Field, ObjectType } from 'type-graphql';
import { UserType } from './user.dto';

@ObjectType()
export class UserLoginType {
  @Field()
  accessToken: string;

  @Field(() => UserType)
  user: UserType;
}
