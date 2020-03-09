import { Schema } from 'mongoose';

export const RecommendationSchema = new Schema({
  uuid: String,
  source: String,
  sourceKind: String,
  destination: String,
  destinationKind: String,
  createdAt: Number,
  recommendedTill: Number,
  active: Boolean,
});
