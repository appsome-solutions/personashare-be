import { IsString, IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CardInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;

  @Field({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  avatar?: string;

  @Field({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  background?: string;
}
