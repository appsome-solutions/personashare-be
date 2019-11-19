import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class ConnectPersonaToSpotInput {
  @Field()
  @IsString()
  uuid: string;

  @Field()
  @IsString()
  personaUuid: string;
}
