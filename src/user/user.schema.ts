import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  uuid: String,
  kind: String,
  name: String,
  email: String,
  photo: String,
  lastIdToken: String,
  personaUUIDs: [String],
  defaultPersona: String,
  spots: [String],
});
