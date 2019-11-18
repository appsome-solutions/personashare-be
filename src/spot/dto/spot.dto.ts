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

  @Field()
  logo?: string;

  @Field()
  image?: string;

  @Field()
  url?: string;

  @Field(() => GraphQLJSONObject)
  details?: object;

  @Field(() => [String])
  personaUUIDs?: string[];
}
