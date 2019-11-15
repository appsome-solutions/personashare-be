import { Field, ObjectType } from 'type-graphql';
import { StringDictionary } from '../../app.interfaces';
import { Schema } from 'mongoose';

@ObjectType()
export class PersonaEventType {
  @Field()
  uuid: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  logo?: string;

  @Field()
  image?: string;

  @Field()
  url?: string;

  @Field()
  details?: StringDictionary;

  @Field()
  speakers?: [Schema.Types.ObjectId];

  @Field()
  personas?: [Schema.Types.ObjectId];
}
