import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class LoginUserInput {
  @Field()
  @IsString()
  idToken: string;

  @Field()
  @IsString()
  csrfToken: string;
}
