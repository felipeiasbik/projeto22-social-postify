import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';

let app: INestApplication;
let prisma: PrismaService;

beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule, PrismaModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  prisma = app.get(PrismaService);

  await prisma.media.deleteMany();
  await prisma.post.deleteMany();
  await prisma.publication.deleteMany();

  await app.init();
});

describe('AppController (e2e)', () => {
  it('/ (GET) health', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(HttpStatus.OK)
      .expect('I’m okay!');
  });

  it('media', () => {
    request(app.getHttpServer())
      .post('medias')
      .send({
        title: 'Instagram',
        username: 'felipeiasbik',
      })
      .expect(HttpStatus.CREATED)
      .expect({
        title: 'Instagram',
        username: 'felipeiasbik',
      });
  });
});
