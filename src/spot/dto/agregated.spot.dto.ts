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

  @Field(() => [AgregatedPersona], { nullable: true })
  networkList: AgregatedPersona[];

  @Field(() => [AgregatedPersona], { nullable: true })
  recommendList: AgregatedPersona[];

  @Field(() => [AgregatedPersona], { nullable: true })
  contactBook: AgregatedPersona[];

  @Field(() => [AgregatedPersona], { nullable: true })
  visibilityList: AgregatedPersona[];

  @Field(() => AgregatedPersona, { nullable: true })
  owner: AgregatedPersona;

  @Field(() => [AgregatedPersona], { nullable: true })
  participants: AgregatedPersona[];

  @Field(() => [AgregatedPersona], { nullable: true })
  managers: AgregatedPersona[];
}
