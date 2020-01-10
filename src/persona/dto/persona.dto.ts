import { Field, ObjectType } from 'type-graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class PersonaType {
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

  @Field(() => GraphQLJSONObject, { nullable: true })
  details?: object;

  @Field(() => [String], { nullable: true })
  personaUUIDs?: string[];
}
