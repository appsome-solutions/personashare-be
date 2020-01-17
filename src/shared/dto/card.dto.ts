import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class CardType {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  background?: string;
}
