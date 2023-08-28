import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';

export class MediasFactories {
  async createMedia(prisma: PrismaService) {
    return await prisma.media.create({
      data: {
        title: faker.company.name(),
        username: faker.person.lastName(),
      },
    });
  }

  async createMediaConflict(prisma: PrismaService) {
    return await prisma.media.create({
      data: {
        title: 'Instagram',
        username: 'myUser',
      },
    });
  }
}
