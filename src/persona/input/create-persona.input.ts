import { Field, InputType } from 'type-graphql';
import { CardInput, PageInput } from '../../shared';

@InputType()
export class CreatePersonaInput {
  @Field(() => CardInput)
  card: CardInput;

  @Field(() => PageInput)
  page: PageInput;
}
