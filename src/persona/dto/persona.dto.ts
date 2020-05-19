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

  @Field()
  qrCodeLink: string;

  @Field(() => [String], { nullable: true })
  networkList: string[];

  @Field(() => [String], { nullable: true })
  spotNetworkList: string[];

  @Field(() => [String], { nullable: true })
  recommendList: string[];

  @Field(() => [String], { nullable: true })
  spotRecommendList: string[];

  @Field(() => [String], { nullable: true })
  contactBook: string[];

  @Field(() => [String], { nullable: true })
  visibilityList: string[];

  @Field(() => [String], { nullable: true })
  spotVisibilityList: string[];

  @Field(() => [String], { nullable: true })
  spotBook: string[];
}
