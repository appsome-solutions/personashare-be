import { Document } from 'mongoose';
import { Card, Page, PersonaEntity } from '../../shared';

type PersonaInterface = PersonaEntity;

interface PersonaDocument extends PersonaInterface, Document {}

type PartialPersonaInterface = {
  readonly uuid: string;
  readonly userId: string;
  card: Card;
  page: Page;
  personaUUIDs: string[];
  qrCodeLink: string;
  networkList: any[];
  recommendList: any[];
  spotNetworkList: any[];
  spotRecommendList: any[];
  spotBook: any[];
  visibilityList: any[];
  spotVisibilityList: any[];
  isActive: boolean;
  contactBook: any[];
  createdAt: number;
};

interface PartialPersonaDocument extends PartialPersonaInterface, Document {}

export {
  PersonaInterface,
  PersonaDocument,
  PartialPersonaInterface,
  PartialPersonaDocument,
};
