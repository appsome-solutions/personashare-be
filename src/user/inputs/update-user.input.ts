import { IsString, IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateUserInput {
  @Field({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @Field({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  photo?: string;
}
