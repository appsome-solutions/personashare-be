import { Document } from 'mongoose';

interface UserInterface {
  readonly uuid: string;
  name: string;
  email: string;
  photo?: string;
  personaUUIDs: string[];
  defaultPersona: string;
  spots: string[];
  lastIdToken: string;
}

interface UserDocument extends UserInterface, Document {}

export { UserInterface, UserDocument };
