import { Schema } from 'mongoose';

export const FeatureKindLimitSchema = new Schema({
  kind: String,
  spot: Object,
  persona: Object,
});
