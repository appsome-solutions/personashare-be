import { Schema } from 'mongoose';

export const PersonaSchema = new Schema({
  uuid: String,
  name: String,
  description: String,
  logo: String,
  image: String,
  details: Object,
  personaUUIDs: [String],
});
