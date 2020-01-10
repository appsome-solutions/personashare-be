import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class RemovePersonaInput {
  @Field()
  @IsString()
  uuid: string;

  @Field()
  @IsString()
  personaUUID: string;
}
