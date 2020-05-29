import { Document } from 'mongoose';
import { Card, Page, PersonaEntity } from '../../shared/interfaces';

type EmailInvitationStatus = 'pending' | 'success' | 'rejected';

type EmailInvitation = {
  email: string;
  status: EmailInvitationStatus;
};

interface SpotInterface extends PersonaEntity {
  participants: string[];
  managers: string[];
  owner: string;
  invitedManagerEmails: EmailInvitation[];
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
  invitedManagerEmails: any[];
};

interface PartialSpotDocument extends PartialSpotInterface, Document {}

export {
  SpotInterface,
  SpotDocument,
  PartialSpotInterface,
  PartialSpotDocument,
};
