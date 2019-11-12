import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Example {
  @Field()
  id: number;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;
}
