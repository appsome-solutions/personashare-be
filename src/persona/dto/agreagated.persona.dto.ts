import { Field, ObjectType } from 'type-graphql';
import { CardType, PageType } from '../../shared';
import { AgregatedSpot } from '../../spot/dto/agregated.spot.dto';

@ObjectType()
export class AgregatedPersona {
  @Field(() => String, { nullable: true })
  uuid: string;

  @Field(() => CardType, { nullable: true })
  card: CardType;

  @Field(() => PageType, { nullable: true })
  page: PageType;

  @Field(() => [String], { nullable: true })
  personaUUIDs?: string[];

  @Field(() => String, { nullable: true })
  qrCodeLink: string;

  @Field(() => [AgregatedPersona], { nullable: true })
  networkList: AgregatedPersona[];

  @Field(() => [AgregatedPersona], { nullable: true })
  recommendList: AgregatedPersona[];

  @Field(() => [AgregatedPersona], { nullable: true })
  contactBook: AgregatedPersona[];

  @Field(() => [AgregatedPersona], { nullable: true })
  visibilityList: AgregatedPersona[];

  @Field(() => [AgregatedSpot], { nullable: true })
  spotBook: AgregatedSpot[];

  @Field(() => [AgregatedSpot], { nullable: true })
  spotNetworkList: AgregatedSpot[];

  @Field(() => [AgregatedSpot], { nullable: true })
  spotRecommendList: AgregatedSpot[];
}
