import { IsString, IsEmail, IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  uuid: string;

  @Field()
  @IsString()
  name: string;

  @Field({
    nullable: true,
  })
  @IsEmail()
  email: string;

  @Field({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  photo?: string;
}
