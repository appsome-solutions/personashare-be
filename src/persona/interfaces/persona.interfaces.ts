import { Document } from 'mongoose';
import { PersonaEntity } from '../../shared';

type PersonaInterface = PersonaEntity;

interface PersonaDocument extends PersonaInterface, Document {}

export { PersonaInterface, PersonaDocument };
