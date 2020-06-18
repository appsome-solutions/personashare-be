import { FeatureKindLimitRecord } from './feature-kind.interfaces';

export const featureLimitsFallback: FeatureKindLimitRecord = {
  free: {
    kind: 'free',
    managers: 3,
    participants: 20,
    networkListForSpot: 5,
  },
  premium: {
    kind: 'premium',
    managers: 6,
    participants: 40,
    networkListForSpot: 10,
  },
};
