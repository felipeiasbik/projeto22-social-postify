import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';

export class PostsFactories {
  async createPost(prisma: PrismaService) {
    return await prisma.post.create({
      data: {
        title: faker.company.name(),
        text: faker.lorem.paragraph(),
        image: faker.internet.url(),
      },
    });
  }
}
