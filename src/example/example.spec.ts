import { Test, TestingModule } from '@nestjs/testing';
import { ExampleModule } from './example.module';

describe('ExampleModule', () => {
  let provider: ExampleModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExampleModule],
    }).compile();

    provider = module.get<ExampleModule>(ExampleModule);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
