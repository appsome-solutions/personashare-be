import { Module } from '@nestjs/common';
import { ExampleService } from './example.service';
import { ExampleResolver } from './example.resolver';

@Module({
  providers: [ExampleService, ExampleResolver],
})
export class ExampleModule {}
