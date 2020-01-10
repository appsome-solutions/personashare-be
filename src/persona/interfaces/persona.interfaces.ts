import { Document } from 'mongoose';
import { SpotInterface } from '../../spot/interfaces/spot.interfaces';

type PersonaInterface = Omit<SpotInterface, 'url'>;

interface PersonaDocument extends PersonaInterface, Document {}

export { PersonaInterface, PersonaDocument };
