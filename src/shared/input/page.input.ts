import { IsString, IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class PageInput {
  @Field()
  @IsString()
  content: string;

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
