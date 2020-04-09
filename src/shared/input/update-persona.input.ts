import { IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { CardInput } from './card.input';
import { PageInput } from './page.input';

@InputType()
export class UpdatePersonaInput {
  @Field({
    nullable: true,
  })
  @IsOptional()
  card?: CardInput;

  @Field({
    nullable: true,
  })
  @IsOptional()
  page?: PageInput;

  @Field({
    nullable: true,
  })
  @IsOptional()
  isActive?: boolean;
}
