import { IsString, IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class PersonaInput {
  @Field()
  @IsString()
  uuid: string;

  @Field({
    nullable: true,
  })
  @IsOptional()
  isActive?: boolean;
}
