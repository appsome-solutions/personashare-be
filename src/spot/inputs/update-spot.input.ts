import { IsString, IsUrl, IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class UpdateSpotInput {
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
  description?: string;

  @Field({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  logo?: string;

  @Field({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  image?: string;

  @Field({
    nullable: true,
  })
  @IsUrl()
  @IsOptional()
  url?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  details?: object;
}
