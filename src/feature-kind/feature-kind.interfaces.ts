import { Document } from 'mongoose';

export type FeatureKind = 'free' | 'premium';

export type FeatureName = 'participants' | 'managers' | 'networkListForSpot';

export type FeatureKindLimit = {
  kind: FeatureKind;
} & Record<FeatureName, number | string>;

export interface FeatureKindLimitDocument extends FeatureKindLimit, Document {}

export type FeatureKindLimitRecord = Record<FeatureKind, FeatureKindLimit>;
