import { Document } from 'mongoose';
import { PersonaEntity } from '../../shared/interfaces';

interface SpotInterface extends PersonaEntity {
  participants: string[];
  owner: string;
}

interface SpotDocument extends SpotInterface, Document {}

export { SpotInterface, SpotDocument };
