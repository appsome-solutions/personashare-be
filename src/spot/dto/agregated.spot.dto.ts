import { Field, ObjectType } from 'type-graphql';
import { CardType, PageType } from '../../shared/dto';
import { AgregatedPersona } from '../../persona/dto/agreagated.persona.dto';

@ObjectType()
export class AgregatedSpot {
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

  @Field(() => Boolean, { nullable: true })
  canPersonaParticipate?: boolean;

  @Field(() => Boolean, { nullable: true })
  canBeRecommended?: boolean;

  @Field(() => [AgregatedPersona], { nullable: true })
  networkList: AgregatedPersona[];

  @Field(() => [AgregatedSpot], { nullable: true })
  spotNetworkList: AgregatedSpot[];

  @Field(() => [AgregatedPersona], { nullable: true })
  recommendList: AgregatedPersona[];

  @Field(() => [AgregatedSpot], { nullable: true })
  spotRecommendList: AgregatedSpot[];

  @Field(() => [AgregatedPersona], { nullable: true })
  contactBook: AgregatedPersona[];

  @Field(() => [AgregatedSpot], { nullable: true })
  spotBook: AgregatedSpot[];

  @Field(() => [AgregatedPersona], { nullable: true })
  visibilityList: AgregatedPersona[];

  @Field(() => [AgregatedSpot], { nullable: true })
  spotVisibilityList: AgregatedSpot[];

  @Field(() => AgregatedPersona, { nullable: true })
  owner: AgregatedPersona;

  @Field(() => [AgregatedPersona], { nullable: true })
  participants: AgregatedPersona[];

  @Field(() => [AgregatedPersona], { nullable: true })
  managers: AgregatedPersona[];
}
