import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('PersonaShare (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const users = Array.from({ length: 100 }, (_v, k) => k);
  console.error(users);

  return users.forEach(id => {
    it(`createUser${id}`, () => {
      return request
        .agent(app.getHttpServer())
        .post('/graphql')
        .send({
          operationName: null,
          variables: {},
          query: `mutation {\n  createUser(user: {name: "test", uuid: "10${id}", email: "test@gmail.com"}) {\n    uuid\n  }\n}\n`,
        })
        .expect(200);
    });
  });
});
