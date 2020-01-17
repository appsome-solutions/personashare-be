import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class PageType {
  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  background?: string;

  @Field()
  content: string;
}
