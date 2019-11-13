import { Resolver, Query, Args } from '@nestjs/graphql';
import { ExampleService } from './example.service';
import { Example } from './dto/example.dto';

@Resolver('Example')
export class ExampleResolver {
  constructor(private readonly exampleService: ExampleService) {}

  @Query(() => Example)
  async getExample(@Args('id') id: string): Promise<Example> {
    return await this.exampleService.getExample(id);
  }
}
