import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import * as request from 'supertest';

describe('Controllers (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  const testCase = [
    {
      user: { firstname: 'Sergey', lastname: 'Platonenko', wishList: ['test'] },
      code: 201,
    },
    {
      user: { firstname: 1, lastname: 1, wishList: [1] },
      code: 400,
    },
    {
      user: { firstname: 'Se', lastname: 'Pl', wishList: ['te'] },
      code: 400,
    },
    {
      user: { firstname: 'Sergey', lastname: 'Platonenko', wishList: [] },
      code: 400,
    },
    {
      user: {
        firstname: 'Sergey',
        lastname: 'Platonenko',
        wishList: [
          'test',
          'test',
          'test',
          'test',
          'test',
          'test',
          'test',
          'test',
          'test',
          'test',
          'test',
        ],
      },
      code: 400,
    },
  ];

  testCase.forEach((test) => {
    it('E2E create user', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send(test.user)
        .expect(test.code);
    });
  });
});
