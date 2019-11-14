import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import * as fs from 'fs';

type EnvConfigSchemaKeys =
  | 'NODE_ENV'
  | 'PORT'
  | 'MONGO_DB_URI'
  | 'BASE_URL'
  | 'TIMEOUT'
  | 'MAX_REDIRECTS'
  | 'APPLICATION_URL';

const allowedKeys: EnvConfigSchemaKeys[] = [
  'NODE_ENV',
  'PORT',
  'MONGO_DB_URI',
  'BASE_URL',
  'TIMEOUT',
  'MAX_REDIRECTS',
  'APPLICATION_URL',
];

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
      APPLICATION_URL: Joi.string().default('http://localhost:3001'),
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

  get ApplicationUrl(): string {
    return this.envConfig.APPLICATION_URL;
  }
}
