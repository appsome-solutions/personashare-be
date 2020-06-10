import { IsString, IsNumber } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UploadFileInput {
  @Field()
  @IsString()
  uid: string;

  @Field()
  @IsNumber()
  size: number;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  url: string;

  @Field()
  @IsString()
  thumbUrl: string;

  @Field()
  status: string;
}
