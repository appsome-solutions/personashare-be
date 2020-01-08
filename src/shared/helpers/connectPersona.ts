import { Model, Document } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { ConnectPersonaInput } from '..';

interface PersonaConnectableDocument extends Document {
  personaUUIDs?: string[];
}

export async function connectPersona<T extends PersonaConnectableDocument>(
  persona: ConnectPersonaInput,
  model: Model<T>,
): Promise<T> {
  const { uuid, personaUUID } = persona;
  const entity = await model.findOne({ uuid });

  if (!entity) {
    throw new NotFoundException(`Can't find entity by uuid: ${uuid}`);
  }

  if (!entity.personaUUIDs) {
    entity.personaUUIDs = [personaUUID];
  } else {
    if (!entity.personaUUIDs.includes(personaUUID)) {
      entity.personaUUIDs = entity.personaUUIDs.concat(personaUUID);
    } else {
      return entity;
    }
  }

  return await entity.save();
}
