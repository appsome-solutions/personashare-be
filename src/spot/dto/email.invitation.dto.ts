import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class EmailInvitation {
  @Field()
  email: string;

  @Field()
  status: string;
}
