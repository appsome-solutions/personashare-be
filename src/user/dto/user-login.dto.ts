import { Field, ObjectType } from 'type-graphql';
import { UserType } from './user.dto';

@ObjectType()
export class UserLoginType {
  @Field(() => UserType)
  user: UserType;
}
