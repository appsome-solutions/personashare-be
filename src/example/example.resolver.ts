import { Resolver, Query } from '@nestjs/graphql';
import { ExampleService } from './example.service';
import { Example } from './dto/example.dto';

@Resolver('Example')
export class ExampleResolver {
  constructor(private readonly exampleService: ExampleService) {}

  @Query(() => Example)
  async getExample() {
    return await this.exampleService.getExample();
  }
}
