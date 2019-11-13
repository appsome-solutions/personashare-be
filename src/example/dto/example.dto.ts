import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Example {
  @Field({ nullable: true })
  qrCodeDataUri?: string;
}
