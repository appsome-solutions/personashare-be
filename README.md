## Description

Appsome backend project based on [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Documentation

```bash
$ yarn doc
```

Open your browser and navigate to [http://localhost:8080](http://localhost:8080).

## Env Variables

In order to run the application You should create a `.env` file with following variables:

```bash
MONGO_DB_URI= //please provide your mongodb connection here
BASE_URL=http://localhost:3000
PORT=3000 //default
APPLICATION_PORT=3001 //default - port on which frontend application is served
FIREBASE_STORAGE_BUCKET= //
FIREBASE_CREDENTIAL_PATH= // path to the secretKey.json
FIREBASE_EXPIRE_IN_SESSION= // default is 300000 = 5 minutes
MAILCHIMP_AUDIENCE_ID= // your audience id
MAILCHIMP_API_KEY= // your API key
BUGSNAG_API_KEY = // your Bugsnag api key
```

These field should be declared because of env fields validation that comes with server bootstrapping.

To be able to run the server and initialize Firebase Admin SKD, You should have a `secretKey.json` file with the following structure:

```$xslt
{
  "type": "service_account",
  "project_id": "personashare-c1889",
  "private_key_id": "private_key_id....",
  "private_key": "-----BEGIN PRIVATE KEY-----"
  "client_email": "firebase-adminsdk-.....,
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-admin....
}
```

## GraphQL Playground

In order to check the GraphQL stuff please run server and check [http://localhost:3000/graphql](http://localhost:3000/graphql).

## Exposing localhost while development

While developing You probably want to test that 3rd party systems ping Your routes directly.
To better handling this scenario, You can use [ngrok](https://ngrok.com/) for safety HTTP tunneling.

First at all, connect Your account with the use of `./ngrok authtoken` described in [ngrok dashboard](https://dashboard.ngrok.com/get-started).

After that, You can start tunneling calling `./ngrok http 3000` which exposes Your `http://localhost:3000`.

In that case You can define `NOTIFY_URL` in Your `.env` file just putting something like that: `NOTIFY_URL=https://485c70ba.ngrok.io/notify`.

## Available endpoints

When server is running, there are some endpoints that can be used to test:

[/app](http://localhost:3000/app) - You can get the QRCode to get to the FE application in mobile device,

[/login](http://localhost:3000/login) - endpoint for testing the sign in feature with Firebase

[/profile](http://localhost:3000/profile) - endpoint for testing the profile page after login

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
