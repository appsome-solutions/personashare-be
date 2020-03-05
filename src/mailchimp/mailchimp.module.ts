import { Module } from '@nestjs/common';
import { MailchimpService } from './mailchimp.service';
import { ConfigModule } from '../config';

@Module({
  imports: [ConfigModule],
  providers: [MailchimpService],
  exports: [MailchimpService],
})
export class MailchimpModule {}
