import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class UserLoginType {
  @Field()
  accessToken: string;
}
