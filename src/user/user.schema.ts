import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  uuid: String,
  name: String,
  email: String,
  photo: String,
  personaUUIDs: [String],
  defaultPersona: String,
  spots: [String],
});
