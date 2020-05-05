import { Field, ObjectType } from 'type-graphql';
import { CardType, PageType } from '../../shared';

@ObjectType()
export class AgregatedPersona {
  @Field()
  uuid: string;

  @Field(() => CardType)
  card: CardType;

  @Field(() => PageType)
  page: PageType;

  @Field(() => [String], { nullable: true })
  personaUUIDs?: string[];

  @Field()
  qrCodeLink: string;

  @Field(() => [String], { nullable: true })
  networkList: string[];

  @Field(() => [AgregatedPersona], { nullable: true })
  recommendList: AgregatedPersona[];

  @Field(() => [AgregatedPersona], { nullable: true })
  contactBook: AgregatedPersona[];

  @Field(() => [AgregatedPersona], { nullable: true })
  visibilityList: AgregatedPersona[];

  @Field(() => [String], { nullable: true })
  spotBook: string[];
}
