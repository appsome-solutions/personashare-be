import { FeatureKindLimitRecord } from './feature-kind.interfaces';

export const featureLimitsFallback: FeatureKindLimitRecord = {
  free: {
    kind: 'free',
    spot: {
      managers: 3,
      participants: 20,
      networkList: 5,
    },
    persona: {
      recommendList: 3,
      spotRecommendList: 3,
    },
  },
  premium: {
    kind: 'premium',
    spot: {
      managers: 6,
      participants: 40,
      networkList: 10,
    },
    persona: {
      recommendList: 6,
      spotRecommendList: 6,
    },
  },
};
