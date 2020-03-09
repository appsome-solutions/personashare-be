import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { MongoService } from '../mongo-service/mongo.service';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import dayjs from 'dayjs';
import { InjectModel } from '@nestjs/mongoose';

import {
  CreateRecommendation,
  RecommendationDocument,
  RecommendationInterface,
  RemoveRecommendation,
} from './interfaces/recommendations.interfaces';

@Injectable()
export class RecommendationsService {
  mongoService: MongoService<Model<RecommendationDocument>>;

  constructor(
    @InjectModel('Recommendations')
    private readonly recommendationsModel: Model<RecommendationDocument>,
  ) {
    this.mongoService = new MongoService(this.recommendationsModel);
  }

  async createRecommendation(
    recommendation: CreateRecommendation,
  ): Promise<RecommendationDocument> {
    const now = dayjs().unix();

    if (now > recommendation.recommendedTill) {
      throw new MethodNotAllowedException(
        'Recommendation time can not be set as past time',
      );
    }

    return await this.mongoService.create<
      RecommendationInterface,
      RecommendationDocument
    >({
      ...recommendation,
      createdAt: now,
      active: true,
      uuid: v4(),
    });
  }

  async removeRecommendation(
    recommendation: RemoveRecommendation,
  ): Promise<RecommendationDocument> {
    return await this.mongoService.update<
      RemoveRecommendation,
      RecommendationDocument
    >(
      {
        active: false,
      },
      recommendation,
    );
  }
}
