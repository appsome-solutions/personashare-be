import { Module } from '@nestjs/common';
import { GqlSelectionParserService } from './gql-selection-parser.service';

@Module({
  providers: [GqlSelectionParserService],
  exports: [GqlSelectionParserService],
})
export class GqlSelectionParserModule {}
