import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { CreatePersonaInput } from '../../persona/input';

@InputType()
export class AddPersonaInput {
  @Field()
  @IsString()
  uuid: string;

  @Field()
  persona: CreatePersonaInput;
}
