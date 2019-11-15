import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { PersonaEventService } from './persona-event.service';
import { PersonaEventType } from './dto/persona-event.dto';
import { CreatePersonaEventInput } from './inputs/create-persona-event.input';

@Resolver('PersonaEvent')
export class PersonaEventResolver {
  constructor(private readonly personaEventService: PersonaEventService) {}

  @Mutation(() => PersonaEventType)
  async createSpecialist(@Args('personaEvent') input: CreatePersonaEventInput) {
    const {
      uuid,
      name,
      description,
      logo,
      image,
      url,
      details,
      speakers,
      personas,
    } = await this.personaEventService.create(input);
    return {
      uuid,
      name,
      description,
      logo,
      image,
      url,
      details,
      speakers,
      personas,
    };
  }
}
