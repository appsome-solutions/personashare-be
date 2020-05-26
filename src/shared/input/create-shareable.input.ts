import { Field, InputType } from 'type-graphql';
import { CardInput, PageInput } from '../index';

@InputType()
export class CreateShareableInput {
  @Field(() => CardInput)
  card: CardInput;

  @Field(() => PageInput)
  page: PageInput;
}
