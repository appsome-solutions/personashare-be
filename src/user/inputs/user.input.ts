import { IsString, IsUrl, IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UserInput {
  @Field({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  uuid?: string;

  @Field({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({
    nullable: true,
  })
  @IsUrl()
  @IsOptional()
  url?: string;
}
