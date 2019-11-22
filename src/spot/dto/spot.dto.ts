import { Field, ObjectType } from 'type-graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class SpotType {
  @Field()
  uuid: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  logo?: string;

  @Field({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  url?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  details?: object;

  @Field(() => [String], { nullable: true })
  personaUUIDs?: string[];
}
