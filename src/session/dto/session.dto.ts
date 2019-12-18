import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class SessionType {
  @Field()
  sid: string;
}
