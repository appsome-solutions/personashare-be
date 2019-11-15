import { Test, TestingModule } from '@nestjs/testing';
import { PersonaEventService } from './persona-event.service';

describe('PersonaEventService', () => {
  let service: PersonaEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonaEventService],
    }).compile();

    service = module.get<PersonaEventService>(PersonaEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
