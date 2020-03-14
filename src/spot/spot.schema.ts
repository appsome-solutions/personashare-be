import { Schema } from 'mongoose';

export const SpotSchema = new Schema({
  uuid: String,
  card: Object,
  page: Object,
  personaUUIDs: [String],
  networkList: [String],
  recommendList: [String],
  qrCodeLink: String,
  participants: [String],
  owner: String,
});
