import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { MongoService } from '../mongo-service/mongo.service';
import {
  FeatureKindLimit,
  FeatureKindLimitDocument,
  FeatureKindLimitRecord,
} from './feature-kind.interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { featureLimitsFallback } from './feature-kind.constants';

@Injectable()
export class FeatureKindService {
  mongoService: MongoService<Model<FeatureKindLimitDocument>>;
  featureKindLimits: FeatureKindLimitRecord;

  constructor(
    @InjectModel('FeatureKindLimit')
    private readonly featureKindLimitModel: Model<FeatureKindLimitDocument>,
  ) {
    this.mongoService = new MongoService(this.featureKindLimitModel);
    this.getFeatureKindLimits();
  }

  async getFeatureKindLimits(): Promise<FeatureKindLimitRecord> {
    if (!this.featureKindLimits) {
      try {
        const limits = await this.mongoService.findAll<FeatureKindLimit>();

        if (!limits.length) {
          await this.mongoService
            .getModel()
            .insertMany(Object.values(featureLimitsFallback));
        } else {
          limits.forEach((element: FeatureKindLimit) => {
            this.featureKindLimits = {
              ...this.featureKindLimits,
              [element.kind]: element,
            };
          });

          return this.featureKindLimits;
        }

        return featureLimitsFallback;
      } catch (_e) {
        return featureLimitsFallback;
      }
    } else {
      return this.featureKindLimits;
    }
  }
}
