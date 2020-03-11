import { Schema } from 'mongoose';

export const SpotSchema = new Schema({
  uuid: String,
  name: String,
  description: String,
  logo: String,
  image: String,
  url: String,
  details: Object,
  personaUUIDs: [String],
  participants: [String],
  qrCodeLink: String,
});
