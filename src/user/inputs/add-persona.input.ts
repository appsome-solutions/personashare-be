import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { CreateShareableInput } from '../../shared/input';

@InputType()
export class AddPersonaInput {
  @Field()
  @IsString()
  uuid: string;

  @Field()
  persona: CreateShareableInput;
}
