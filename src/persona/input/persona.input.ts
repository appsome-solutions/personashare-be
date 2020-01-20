import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class PersonaInput {
  @Field()
  @IsString()
  uuid: string;
}
