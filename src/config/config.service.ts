import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

type EnvConfigSchemaKeys =
  | 'NODE_ENV'
  | 'PORT'
  | 'MONGO_DB_URI'
  | 'BASE_URL'
  | 'TIMEOUT'
  | 'MAX_REDIRECTS'
  | 'APPLICATION_PORT'
  | 'FIREBASE_API_KEY'
  | 'FIREBASE_AUTH_DOMAIN'
  | 'FIREBASE_DB_URL'
  | 'FIREBASE_PROJECT_ID'
  | 'FIREBASE_STORAGE_BUCKET'
  | 'FIREBASE_MESSAGING_SENDER_ID'
  | 'FIREBASE_APP_ID';

const allowedKeys: EnvConfigSchemaKeys[] = [
  'NODE_ENV',
  'PORT',
  'MONGO_DB_URI',
  'BASE_URL',
  'TIMEOUT',
  'MAX_REDIRECTS',
  'APPLICATION_PORT',
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_DB_URL',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
];

@Injectable()
export class ConfigService {
  private readonly envConfig: Record<EnvConfigSchemaKeys, string>;

  constructor(filePath: string) {
    let config;

    if (fs.existsSync(filePath)) {
      config = dotenv.parse(fs.readFileSync(filePath));
    } else {
      config = Object.keys(process.env)
        .filter(key => allowedKeys.includes(key as EnvConfigSchemaKeys))
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: process.env[key],
          };
        }, {});
    }

    this.envConfig = ConfigService.validateInput(config);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private static validateInput(
    envConfig: Record<string, string>,
  ): Record<EnvConfigSchemaKeys, string> {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['development', 'production', 'test'])
        .default('development'),
      PORT: Joi.number().default(3000),
      MONGO_DB_URI: Joi.string().default('mongodb://localhost:27017/test'),
      TIMEOUT: Joi.number().default(30000),
      MAX_REDIRECTS: Joi.number().default(0),
      BASE_URL: Joi.string()
        .uri()
        .required(),
      APPLICATION_PORT: Joi.number().default(3001),
      FIREBASE_API_KEY: Joi.string().required(),
      FIREBASE_AUTH_DOMAIN: Joi.string().required(),
      FIREBASE_DB_URL: Joi.string().required(),
      FIREBASE_PROJECT_ID: Joi.string().required(),
      FIREBASE_STORAGE_BUCKET: Joi.string(),
      FIREBASE_MESSAGING_SENDER_ID: Joi.string(),
      FIREBASE_APP_ID: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
    );

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return validatedEnvConfig;
  }

  get baseUrl(): string {
    return this.envConfig.BASE_URL;
  }

  get isDevEnv(): boolean {
    return this.envConfig.NODE_ENV === 'development';
  }

  get port(): number {
    return Number(this.envConfig.PORT);
  }

  get timeout(): number {
    return Number(this.envConfig.TIMEOUT);
  }

  get maxRedirects(): number {
    return Number(this.envConfig.MAX_REDIRECTS);
  }

  get MongoDBURI(): string {
    return this.envConfig.MONGO_DB_URI;
  }

  get applicationPort(): number {
    return Number(this.envConfig.APPLICATION_PORT);
  }

  get FirebaseAPIKey(): string {
    return this.envConfig.FIREBASE_API_KEY;
  }

  get FirebaseAuthDomain(): string {
    return this.envConfig.FIREBASE_AUTH_DOMAIN;
  }

  get FirebaseDbUrl(): string {
    return this.envConfig.FIREBASE_DB_URL;
  }

  get FirebaseProjectId(): string {
    return this.envConfig.FIREBASE_PROJECT_ID;
  }

  get FirebaseStorageBucket(): string {
    return this.envConfig.FIREBASE_STORAGE_BUCKET;
  }

  get FirebaseMessagingSenderId(): string {
    return this.envConfig.FIREBASE_MESSAGING_SENDER_ID;
  }

  get FirebaseAppId(): string {
    return this.envConfig.FIREBASE_APP_ID;
  }
}
