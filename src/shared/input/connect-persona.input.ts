import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class ConnectPersonaInput {
  @Field()
  @IsString()
  uuid: string;

  @Field()
  @IsString()
  personaUUID: string;
}
