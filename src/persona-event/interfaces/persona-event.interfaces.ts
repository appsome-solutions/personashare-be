import { Document, Schema } from 'mongoose';
import { StringDictionary } from '../../app.interfaces';

interface PersonaEventInterface {
  readonly uuid: string;
  name: string;
  description: string;
  logo?: string;
  image?: string;
  url?: string;
  details?: StringDictionary;
  speakers?: [Schema.Types.ObjectId];
  personas?: [Schema.Types.ObjectId];
}

interface PersonaEventDocument extends PersonaEventInterface, Document {}

export { PersonaEventInterface, PersonaEventDocument };
