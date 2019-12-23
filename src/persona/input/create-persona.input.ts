import { IsString, IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class CreatePersonaInput {
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
  logo?: string;

  @Field({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  image?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  details?: object;
}
