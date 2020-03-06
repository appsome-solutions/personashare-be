import { Schema } from 'mongoose';

export const PersonaSchema = new Schema({
  uuid: String,
  card: Object,
  page: Object,
  personaUUIDs: [String],
  networkList: [String],
  qrCodeLink: String,
});
