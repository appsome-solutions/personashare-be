import { IsString, IsUrl } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { StringDictionary } from '../../app.interfaces';

@InputType()
export class CreatePersonaEventInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsString()
  logo?: string;

  @Field()
  @IsString()
  image?: string;

  @Field()
  @IsUrl()
  url?: string;

  @Field()
  details?: StringDictionary;
}
