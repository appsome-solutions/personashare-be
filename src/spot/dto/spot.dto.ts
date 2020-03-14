import { Field, ObjectType } from 'type-graphql';
import { CardType, PageType } from '../../shared/dto';

@ObjectType()
export class SpotType {
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
  recommendList: string[];

  @Field()
  owner: string;

  @Field(() => [String], { nullable: true })
  participants: string[];

  @Field(() => [String], { nullable: true })
  managers: string[];
}
