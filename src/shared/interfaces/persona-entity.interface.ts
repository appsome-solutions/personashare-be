import { Document } from 'mongoose';
import { Card } from './card.interface';
import { Page } from './page.interface';

export interface PersonaEntity {
  readonly uuid: string;
  card: Card;
  page: Page;
  personaUUIDs: string[];
  qrCodeLink: string;
  networkList: string[];
  recommendList: string[];
}

export interface PersonaEntityDocument extends PersonaEntity, Document {}
