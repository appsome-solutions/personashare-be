import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RecommendationSchema } from './resommendations.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Recommendations', schema: RecommendationSchema },
    ]),
  ],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}
