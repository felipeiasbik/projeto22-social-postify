import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { MediasFactories } from './factories/medias.factory';
import { PostsFactories } from './factories/posts.factory';
import { PublicationsFactories } from './factories/publications.factory';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let server: request.SuperTest<request.Test>;
  let mediasFactories: MediasFactories;
  let postsFactories: PostsFactories;
  let publicationsFactories: PublicationsFactories;

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
    server = request(app.getHttpServer());

    mediasFactories = new MediasFactories();
    postsFactories = new PostsFactories();
    publicationsFactories = new PublicationsFactories();
  });

  describe('/health', () => {
    describe('/ (GET) health', () => {
      it('should return text "I’m okay!" and Status 200', async () => {
        const { status, text } = await server.get('/health');
        expect(status).toBe(HttpStatus.OK);
        expect(text).toEqual('I’m okay!');
      });
    });
  });

  describe('/medias', () => {
    describe('/ (POST) medias', () => {
      it('should create media and respond with status 201', async () => {
        const title = faker.company.name();
        const username = faker.person.lastName();

        const { status, body } = await server
          .post('/medias')
          .send({ title, username });
        expect(status).toBe(HttpStatus.CREATED);
        expect(body).toEqual({
          id: expect.any(Number),
          title: expect.any(String),
          username: expect.any(String),
        });
      });

      it('should respond status 400 in the absence of mandatory fields', async () => {
        const { status } = await server.post('/medias').send({
          title: faker.company.name(),
        });
        expect(status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should respond status 409 when creating media with data identical to an existing one', async () => {
        await mediasFactories.createMediaConflict(prisma);
        const { status } = await server.post('/medias').send({
          title: 'Instagram',
          username: 'myUser',
        });
        expect(status).toBe(HttpStatus.CONFLICT);
      });
    });

    describe('/ (GET) medias', () => {
      it('should respond with an empty array when there are not media and status 200', async () => {
        const { status, body } = await server.get('/medias');
        expect(status).toBe(HttpStatus.OK);
        expect(body).toEqual([]);
      });

      it('should respond with an array with size 5 with the medias', async () => {
        const size = 5;
        for (let i = 0; i < size; i++) {
          await mediasFactories.createMedia(prisma);
        }
        const { status, body } = await server.get('/medias');
        expect(status).toBe(HttpStatus.OK);
        expect(body).toHaveLength(size);
        expect(body).toEqual(
          expect.arrayContaining([
            {
              id: expect.any(Number),
              title: expect.any(String),
              username: expect.any(String),
            },
          ]),
        );
      });
    });

    describe('/ (GET) medias/:id', () => {
      it('should respond with array with size 1 and status 200', async () => {
        const { id, title, username } =
          await mediasFactories.createMedia(prisma);
        const { status, body } = await server.get(`/medias/${id}`);

        expect(status).toBe(HttpStatus.OK);
        expect(body).toEqual({ id, title, username });
      });

      it('should repond with status 404 if there are no records with the id', async () => {
        const { status } = await server.get('/medias/1');
        expect(status).toBe(HttpStatus.NOT_FOUND);
      });
    });

    describe('/ (PUT) medias/:id', () => {
      it('should update the record and return with status 200', async () => {
        const { id } = await mediasFactories.createMedia(prisma);
        const title = faker.company.name();
        const username = faker.person.lastName();
        const { status } = await server
          .put(`/medias/${id}`)
          .send({ title, username });

        expect(status).toBe(HttpStatus.OK);
      });

      it('should return status 404 if there are no records with the id', async () => {
        const title = faker.company.name();
        const username = faker.person.lastName();

        const { status } = await server
          .put('/medias/1')
          .send({ title, username });

        expect(status).toBe(HttpStatus.NOT_FOUND);
      });

      it('should return status 409 if equal data already exists in the records', async () => {
        const { id } = await mediasFactories.createMediaConflict(prisma);
        const { status } = await server
          .put(`/medias/${id}`)
          .send({ title: 'Instagram', username: 'myUser' });

        expect(status).toBe(HttpStatus.CONFLICT);
      });
    });

    describe('/ (DELETE) medias/:id', () => {
      it('should delete record matching id and respond with 200', async () => {
        const { id } = await mediasFactories.createMedia(prisma);
        const { status } = await server.delete(`/medias/${id}`);

        expect(status).toBe(HttpStatus.OK);
      });

      it('should respond with 404 if there are no records with the id', async () => {
        const { status } = await server.delete('/medias/1');
        expect(status).toBe(HttpStatus.NOT_FOUND);
      });

      it('should respond with 403 if there is a publication scheduled or published with the id of the media', async () => {
        const { id } = await mediasFactories.createMedia(prisma);
        await postsFactories.createPost(prisma);
        await publicationsFactories.createPublications(prisma);

        const { status } = await server.delete(`/medias/${id}`);
        expect(status).toBe(HttpStatus.FORBIDDEN);
      });
    });
  });

  describe('/posts', () => {
    describe('/ (POST) posts', () => {
      it('should create post and respond with status 201', async () => {
        const title = faker.company.name();
        const text = faker.person.lastName();
        const image = null;

        const { status, body } = await server
          .post('/posts')
          .send({ title, text, image });
        expect(status).toBe(HttpStatus.CREATED);
        expect(body).toEqual({
          id: expect.any(Number),
          title: expect.any(String),
          text: expect.any(String),
          image: null,
        });
      });

      it('should respond status 400 in the absence of mandatory fields', async () => {
        const { status } = await server.post('/posts').send({
          title: faker.company.name(),
        });
        expect(status).toBe(HttpStatus.BAD_REQUEST);
      });
    });

    describe('/ (GET) posts', () => {
      it('should respond with an empty array when there are not post and status 200', async () => {
        const { status, body } = await server.get('/posts');
        expect(status).toBe(HttpStatus.OK);
        expect(body).toEqual([]);
      });

      it('should respond with an array with size 5 with the posts', async () => {
        const size = 5;
        for (let i = 0; i < size; i++) {
          await postsFactories.createPost(prisma);
        }
        const { status, body } = await server.get('/posts');
        expect(status).toBe(HttpStatus.OK);
        expect(body).toHaveLength(size);
        expect(body).toEqual(
          expect.arrayContaining([
            {
              id: expect.any(Number),
              title: expect.any(String),
              text: expect.any(String),
              image: expect.any(String),
            },
          ]),
        );
      });
    });

    describe('/ (GET) posts/:id', () => {
      it('should respond with array with size 1 and status 200', async () => {
        const { id, title, text, image } =
          await postsFactories.createPost(prisma);
        const { status, body } = await server.get(`/posts/${id}`);

        expect(status).toBe(HttpStatus.OK);
        expect(body).toEqual({ id, title, text, image });
      });

      it('should repond with status 404 if there are no records with the id', async () => {
        const { status } = await server.get('/posts/1');
        expect(status).toBe(HttpStatus.NOT_FOUND);
      });
    });

    describe('/ (PUT) posts/:id', () => {
      it('should update the record and return with status 200', async () => {
        const { id } = await postsFactories.createPost(prisma);
        const title = faker.company.name();
        const text = faker.person.lastName();
        const image = faker.internet.url();
        const { status } = await server
          .put(`/posts/${id}`)
          .send({ title, text, image });

        expect(status).toBe(HttpStatus.OK);
      });

      it('should return status 404 if there are no records with the id', async () => {
        const title = faker.company.name();
        const text = faker.person.lastName();
        const image = faker.internet.url();

        const { status } = await server
          .put('/posts/1')
          .send({ title, text, image });

        expect(status).toBe(HttpStatus.NOT_FOUND);
      });
    });

    describe('/ (DELETE) posts/:id', () => {
      it('should delete record matching id and respond with 200', async () => {
        const { id } = await postsFactories.createPost(prisma);
        const { status } = await server.delete(`/posts/${id}`);

        expect(status).toBe(HttpStatus.OK);
      });

      it('should respond with 404 if there are no records with the id', async () => {
        const { status } = await server.delete('/posts/1');
        expect(status).toBe(HttpStatus.NOT_FOUND);
      });

      it('should respond with 403 if there is a publication scheduled or published with the id of the media', async () => {
        await mediasFactories.createMedia(prisma);
        const { id } = await postsFactories.createPost(prisma);
        await publicationsFactories.createPublications(prisma);

        const { status } = await server.delete(`/posts/${id}`);
        expect(status).toBe(HttpStatus.FORBIDDEN);
      });
    });
  });

  describe('/publications', () => {
    describe('/ (POST) publications', () => {
      it('should create publication and respond with status 201', async () => {
        const mediaId = await mediasFactories.createMedia(prisma);
        const postId = await postsFactories.createPost(prisma);
        const date = new Date();

        const { status, body } = await server.post('/publications').send({
          mediaId: mediaId.id,
          postId: postId.id,
          date,
        });

        expect(status).toBe(HttpStatus.CREATED);
        expect(body).toEqual({
          id: expect.any(Number),
          mediaId: expect.any(Number),
          postId: expect.any(Number),
          date: expect.any(String),
        });
      });

      it('should respond status 400 in the absence of mandatory fields', async () => {
        const mediaId = await mediasFactories.createMedia(prisma);
        const { status } = await server.post('/publications').send({
          mediaId: mediaId.id,
        });
        expect(status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should respond status 404 if there are no compatible mediaId and postId', async () => {
        const mediaId = await mediasFactories.createMedia(prisma);
        const { status } = await server.post('/publications').send({
          mediaId: mediaId.id,
          postId: 1,
          date: new Date(),
        });
        expect(status).toBe(HttpStatus.NOT_FOUND);
      });
    });

    describe('/ (GET) publications', () => {
      it('should respond with an empty array when there are not post and status 200', async () => {
        const { status, body } = await server.get('/publications');
        expect(status).toBe(HttpStatus.OK);
        expect(body).toEqual([]);
      });

      it('should respond with an array with size 5 with the posts', async () => {
        await mediasFactories.createMedia(prisma);
        await postsFactories.createPost(prisma);
        const size = 5;
        for (let i = 0; i < size; i++) {
          await publicationsFactories.createPublications(prisma);
        }
        const { status, body } = await server.get('/publications');
        expect(status).toBe(HttpStatus.OK);
        expect(body).toHaveLength(size);
        expect(body).toEqual(
          expect.arrayContaining([
            {
              id: expect.any(Number),
              mediaId: expect.any(Number),
              postId: expect.any(Number),
              date: expect.any(String),
            },
          ]),
        );
      });
    });

    describe('/ (GET) publications/:id', () => {
      it('should respond with array with size 1 and status 200', async () => {
        await mediasFactories.createMedia(prisma);
        await postsFactories.createPost(prisma);
        const { id } = await publicationsFactories.createPublications(prisma);
        const { status, body } = await server.get(`/publications/${id}`);

        expect(status).toBe(HttpStatus.OK);
        expect(body).toEqual({
          id: expect.any(Number),
          mediaId: expect.any(Number),
          postId: expect.any(Number),
          date: expect.any(String),
        });
      });

      it('should repond with status 404 if there are no records with the id', async () => {
        const { status } = await server.get('/publications/1');
        expect(status).toBe(HttpStatus.NOT_FOUND);
      });
    });

    describe('/ (PUT) publications/:id', () => {
      it('should update the record and return with status 200', async () => {
        await mediasFactories.createMedia(prisma);
        const postIdPut = await postsFactories.createPost(prisma);
        const { id } = await publicationsFactories.createPublications(prisma);
        const mediaIdPut = await mediasFactories.createMedia(prisma);
        const mediaId = mediaIdPut.id;
        const postId = postIdPut.id;
        const date = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        const { status } = await server
          .put(`/publications/${id}`)
          .send({ mediaId, postId, date });

        expect(status).toBe(HttpStatus.OK);
      });

      it('should respond with status 403 if publication has already been posted', async () => {
        await mediasFactories.createMedia(prisma);
        const postIdPut = await postsFactories.createPost(prisma);
        const { id } =
          await publicationsFactories.createPublicationsPublished(prisma);
        const mediaIdPut = await mediasFactories.createMedia(prisma);
        const mediaId = mediaIdPut.id;
        const postId = postIdPut.id;
        const date = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        const { status } = await server
          .put(`/publications/${id}`)
          .send({ mediaId, postId, date });

        expect(status).toBe(HttpStatus.FORBIDDEN);
      });

      it('should return status 404 if there are no records with the id', async () => {
        await mediasFactories.createMedia(prisma);
        const postIdPut = await postsFactories.createPost(prisma);
        await publicationsFactories.createPublications(prisma);
        const mediaIdPut = await mediasFactories.createMedia(prisma);
        const mediaId = mediaIdPut.id;
        const postId = postIdPut.id;
        const date = new Date();

        const { status } = await server
          .put('/publications/1')
          .send({ mediaId, postId, date });

        expect(status).toBe(HttpStatus.NOT_FOUND);
      });

      it('should return status 404 if there are no compatible mediaId and postId', async () => {
        await mediasFactories.createMedia(prisma);
        const postIdPut = await postsFactories.createPost(prisma);
        await publicationsFactories.createPublications(prisma);
        const postId = postIdPut.id;
        const date = new Date();

        const { status } = await server
          .put('/publications/1')
          .send({ mediaId: 1, postId, date });

        expect(status).toBe(HttpStatus.NOT_FOUND);
      });
    });

    describe('/ (DELETE) publications/:id', () => {
      it('should delete record matching id and respond with 200', async () => {
        await mediasFactories.createMedia(prisma);
        await postsFactories.createPost(prisma);
        const { id } = await publicationsFactories.createPublications(prisma);
        const { status } = await server.delete(`/publications/${id}`);

        expect(status).toBe(HttpStatus.OK);
      });

      it('should respond with 404 if there are no records with the id', async () => {
        const { status } = await server.delete('/publications/1');
        expect(status).toBe(HttpStatus.NOT_FOUND);
      });
    });
  });
});
