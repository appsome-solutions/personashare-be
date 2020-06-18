import { Module } from '@nestjs/common';
import { FeatureKindService } from './feature-kind.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FeatureKindLimitSchema } from './feature-kind.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'FeatureKindLimit', schema: FeatureKindLimitSchema },
    ]),
  ],
  providers: [FeatureKindService],
  exports: [FeatureKindService],
})
export class FeatureKindModule {}
