import { Field, ObjectType } from 'type-graphql';
import { CardType, PageType } from '../../shared';

@ObjectType()
export class PersonaType {
  @Field()
  uuid: string;

  @Field(() => CardType)
  card: CardType;

  @Field(() => PageType)
  page: PageType;

  @Field(() => [String], { nullable: true })
  personaUUIDs?: string[];
}
