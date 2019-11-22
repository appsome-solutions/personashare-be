import { Document } from 'mongoose';

interface SpotInterface {
  readonly uuid: string;
  name: string;
  description: string;
  logo?: string;
  image?: string;
  url?: string;
  details?: object;
  personaUUIDs?: string[];
}

interface SpotDocument extends SpotInterface, Document {}

export { SpotInterface, SpotDocument };
