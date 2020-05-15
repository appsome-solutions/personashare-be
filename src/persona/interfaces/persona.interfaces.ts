import { Document } from 'mongoose';
import { Card, Page, PersonaEntity } from '../../shared';

type PersonaInterface = PersonaEntity;

interface PersonaDocument extends PersonaInterface, Document {}

type PartialPersonaInterface = {
  readonly uuid: string;
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
};

interface PartialPersonaDocument extends PartialPersonaInterface, Document {}

export {
  PersonaInterface,
  PersonaDocument,
  PartialPersonaInterface,
  PartialPersonaDocument,
};
