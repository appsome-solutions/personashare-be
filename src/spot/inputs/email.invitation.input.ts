import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class EmailInvitationInput {
  @Field()
  @IsString()
  email: string;

  @Field()
  @IsString()
  status?: string;
}
