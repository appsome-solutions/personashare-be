import { IsString, IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class PersonaInput {
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
}
