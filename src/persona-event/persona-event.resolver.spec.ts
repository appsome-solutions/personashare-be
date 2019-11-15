import { Test, TestingModule } from '@nestjs/testing';
import { PersonaEventResolver } from './persona-event.resolver';

describe('PersonaEventResolver', () => {
  let resolver: PersonaEventResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonaEventResolver],
    }).compile();

    resolver = module.get<PersonaEventResolver>(PersonaEventResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
