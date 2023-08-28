import { PrismaService } from '../../src/prisma/prisma.service';

export class PublicationsFactories {
  async createPublications(prisma: PrismaService) {
    const mediaId = await prisma.media.findFirst();
    const postId = await prisma.post.findFirst();

    return await prisma.publication.create({
      data: {
        mediaId: mediaId.id,
        postId: postId.id,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
  }

  async createPublicationsPublished(prisma: PrismaService) {
    const mediaId = await prisma.media.findFirst();
    const postId = await prisma.post.findFirst();

    return await prisma.publication.create({
      data: {
        mediaId: mediaId.id,
        postId: postId.id,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    });
  }
}
