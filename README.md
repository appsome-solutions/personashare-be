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
APPLICATION_URL=http://localhost:3001 //default - url to the frontend application
```

These field should be declared because of env fields validation that comes with server bootstrapping.

## GraphQL Playground

In order to check the GraphQL stuff please run server and check [http://localhost:3000/graphql](http://localhost:3000/graphql).

## Exposing localhost while development

While developing You probably want to test that 3rd party systems ping Your routes directly.
To better handling this scenario, You can use [ngrok](https://ngrok.com/) for safety HTTP tunneling.

First at all, connect Your account with the use of `./ngrok authtoken` described in [ngrok dashboard](https://dashboard.ngrok.com/get-started).

After that, You can start tunneling calling `./ngrok http 3000` which exposes Your `http://localhost:3000`.

In that case You can define `NOTIFY_URL` in Your `.env` file just putting something like that: `NOTIFY_URL=https://485c70ba.ngrok.io/notify`.

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
