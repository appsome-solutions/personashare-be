import { Model, Document } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { RemovePersonaInput } from '../../user/inputs';

interface PersonaConnectableDocument extends Document {
  personaUUIDs?: string[];
}

export async function disconnectPersona<T extends PersonaConnectableDocument>(
  persona: RemovePersonaInput,
  model: Model<T>,
): Promise<T> {
  const { uuid, personaUUID } = persona;
  const entity = await model.findOne({ uuid });

  if (!entity) {
    throw new NotFoundException(`Can't find entity by uuid: ${uuid}`);
  }

  if (entity.personaUUIDs) {
    entity.personaUUIDs = entity.personaUUIDs.filter(id => id !== personaUUID);
  }

  return await entity.save();
}
