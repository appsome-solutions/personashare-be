import { Document } from 'mongoose';

interface SpotInterface {
  readonly uuid: string;
  name: string;
  personaUUIDs?: string[];
  participants: string[];
  description: string;
  logo?: string;
  image?: string;
  url?: string;
  details?: object;
  qrCodeLink: string;
}

interface SpotDocument extends SpotInterface, Document {}

export { SpotInterface, SpotDocument };
