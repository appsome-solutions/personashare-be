import { Field, InputType } from 'type-graphql';

@InputType()
export class RemoveEntityInput {
  @Field({
    nullable: true,
  })
  isActive: boolean;
}
