import { IsString, IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class SpotInput {
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
  owner?: string;
}
