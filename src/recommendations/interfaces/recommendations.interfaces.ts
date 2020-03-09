import { Document } from 'mongoose';
import { EntityKind } from '../../shared/interfaces';

interface RecommendationInterface {
  readonly uuid: string;
  readonly source: string;
  readonly sourceKind: EntityKind;
  readonly destination: string;
  readonly destinationKind: EntityKind;
  readonly createdAt: number;
  recommendedTill: number;
  active: boolean;
}

type CreateRecommendation = Omit<
  RecommendationInterface,
  'uuid' | 'createdAt' | 'active'
>;

type RemoveRecommendation = Partial<RecommendationInterface>;

interface RecommendationDocument extends RecommendationInterface, Document {}

export {
  RecommendationInterface,
  RecommendationDocument,
  CreateRecommendation,
  RemoveRecommendation,
};
