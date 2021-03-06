import { Schema } from 'mongoose';

export const PersonaSchema = new Schema({
  uuid: String,
  userId: String,
  card: Object,
  page: Object,
  personaUUIDs: [String],
  networkList: [String],
  recommendList: [String],
  spotNetworkList: [String],
  spotRecommendList: [String],
  qrCodeLink: String,
  contactBook: [String],
  spotBook: [String],
  visibilityList: [String],
  spotVisibilityList: [String],
  isActive: Boolean,
  createdAt: Number,
});
