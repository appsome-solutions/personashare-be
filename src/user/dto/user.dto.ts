import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class UserType {
  @Field()
  uuid: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  photo?: string;

  @Field(() => [String], { nullable: true })
  personaUUIDs?: string[];

  @Field({ nullable: true })
  defaultPersona: string;

  @Field(() => [String], { nullable: true })
  spots?: string[];
}
