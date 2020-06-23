import { Document } from 'mongoose';

export type FeatureKind = 'free' | 'premium';

export type SpotFeatureName = 'participants' | 'managers' | 'networkList';

export type PersonaFeatureName =
  | 'recommendList'
  | 'spotRecommendList'
  | 'networkList';

export type FeatureName = SpotFeatureName & PersonaFeatureName;

export type FeatureKindLimit = {
  kind: FeatureKind;
  spot: Record<SpotFeatureName, number | string>;
  persona: Record<PersonaFeatureName, number | string>;
};

export interface FeatureKindLimitDocument extends FeatureKindLimit, Document {}

export type FeatureKindLimitRecord = Record<FeatureKind, FeatureKindLimit>;
