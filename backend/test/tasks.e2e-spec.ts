import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Tasks (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects a task without a title', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ description: 'missing title' })
      .expect(400);
  });

  it('creates, lists, filters, updates status, and deletes a task', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'e2e test task', description: 'created by e2e test' })
      .expect(201);

    expect(createRes.body).toMatchObject({
      title: 'e2e test task',
      status: 'todo',
    });
    const taskId = createRes.body.id;

    const listRes = await request(app.getHttpServer()).get('/tasks').expect(200);
    expect(listRes.body.some((t: { id: string }) => t.id === taskId)).toBe(true);

    const filteredRes = await request(app.getHttpServer())
      .get('/tasks')
      .query({ status: 'todo' })
      .expect(200);
    expect(filteredRes.body.every((t: { status: string }) => t.status === 'todo')).toBe(true);

    const updateRes = await request(app.getHttpServer())
      .patch(`/tasks/${taskId}/status`)
      .send({ status: 'done' })
      .expect(200);
    expect(updateRes.body.status).toBe('done');

    await request(app.getHttpServer()).delete(`/tasks/${taskId}`).expect(204);

    await request(app.getHttpServer()).get(`/tasks/${taskId}`).expect(404);
  });

  it('returns 404 when updating the status of a non-existent task', () => {
    return request(app.getHttpServer())
      .patch('/tasks/does-not-exist/status')
      .send({ status: 'done' })
      .expect(404);
  });
});
