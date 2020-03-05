import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import * as Joi from 'joi';
import md5 from 'md5';

import { ConfigService } from '../config';

@Injectable()
export class MailchimpService {
  axios: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    const { MailchimpUserName, MailchimpApiKey } = this.configService;

    this.axios = axios.create({
      baseURL: 'https://us19.api.mailchimp.com/3.0',
      auth: {
        username: MailchimpUserName,
        password: MailchimpApiKey,
      },
    });
  }

  async subscribe(email: string): Promise<boolean> {
    const { MailchimpAudienceId } = this.configService;
    const schema = Joi.string().email();

    Joi.assert(email, schema, new Error('Email is not valid'));

    return await this.axios.put(
      `/lists/${MailchimpAudienceId}/members/${md5(email)}`,
      {
        // eslint-disable-next-line @typescript-eslint/camelcase
        email_address: email,
        status: 'pending',
      },
    );
  }
}
