import { Document } from 'mongoose';
import { FeatureKind } from '../../feature-kind';

interface UserInterface {
  readonly uuid: string;
  name: string;
  kind: FeatureKind;
  email: string;
  photo?: string;
  personaUUIDs: string[];
  defaultPersona: string;
  spots: string[];
  lastIdToken: string;
}

interface UserDocument extends UserInterface, Document {}

export { UserInterface, UserDocument };
