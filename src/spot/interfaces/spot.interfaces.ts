import { Document } from 'mongoose';
import { Card, Page, PersonaEntity } from '../../shared/interfaces';

interface SpotInterface extends PersonaEntity {
  participants: string[];
  managers: string[];
  owner: string;
  invitedManagerEmails: string[];
}

interface SpotDocument extends SpotInterface, Document {}

type PartialSpotInterface = {
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
  participants: any[];
  managers: any[];
  owner: any;
  invitedManagerEmails: string[];
};

interface PartialSpotDocument extends PartialSpotInterface, Document {}

export {
  SpotInterface,
  SpotDocument,
  PartialSpotInterface,
  PartialSpotDocument,
};
