import { Document } from 'mongoose';
import { Card } from './card.interface';
import { Page } from './page.interface';

export interface PersonaEntity {
  readonly uuid: string;
  readonly userId: string;
  card: Card;
  page: Page;
  personaUUIDs: string[];
  qrCodeLink: string;
  networkList: string[];
  recommendList: string[];
  spotNetworkList: string[];
  spotRecommendList: string[];
  contactBook: string[];
  spotBook: string[];
  visibilityList: string[];
  spotVisibilityList: string[];
  isActive: boolean;
  createdAt: number;
}

export interface PersonaEntityDocument extends PersonaEntity, Document {}
