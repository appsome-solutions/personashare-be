import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class UploadFileDto {
  @Field()
  uid: string;

  @Field()
  size: number;

  @Field()
  name: string;

  @Field()
  url: string;

  @Field()
  thumbUrl: string;

  @Field()
  status: string;
}
