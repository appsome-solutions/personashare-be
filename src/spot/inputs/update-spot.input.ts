import { IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { CardInput, PageInput } from '../../shared/input';
import { EmailInvitationInput } from './email.invitation.input';

@InputType()
export class UpdateSpotInput {
  @Field({
    nullable: true,
  })
  @IsOptional()
  card?: CardInput;

  @Field({
    nullable: true,
  })
  @IsOptional()
  page?: PageInput;

  @Field(() => [EmailInvitationInput], { nullable: true })
  invitedManagerEmails?: EmailInvitationInput[];
}
