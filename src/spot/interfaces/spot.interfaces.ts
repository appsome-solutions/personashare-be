import { Document } from 'mongoose';

interface SpotInterface {
  readonly uuid: string;
  name: string;
  personaUUIDs?: string[];
  description: string;
  logo?: string;
  image?: string;
  url?: string;
  details?: object;
}

interface SpotDocument extends SpotInterface, Document {}

export { SpotInterface, SpotDocument };
