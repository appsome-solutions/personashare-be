import { Schema } from 'mongoose';

export const FeatureKindLimitSchema = new Schema({
  kind: String,
  participants: Number,
  managers: Number,
  networkListForSpot: Number,
});
