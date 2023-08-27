import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';

@Injectable()
export class PublicationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPublication(data: CreatePublicationDto) {
    return await this.prisma.publication.create({ data });
  }

  async getPublicationsPublished(published: string, after: string) {
    if (published === 'true' && !after) {
      console.log('1, ' + published, after, new Date());
      return await this.prisma.publication.findMany({
        where: { date: { lt: new Date() } },
        orderBy: { date: 'asc' },
      });
    }
    if (published === 'false' && !after) {
      console.log('2, ' + published, after, new Date());
      return await this.prisma.publication.findMany({
        where: { date: { gt: new Date() } },
        orderBy: { date: 'asc' },
      });
    }
    if (published === 'true' && after.length > 0) {
      console.log('3, ' + published, after, new Date());
      return await this.prisma.publication.findMany({
        where: {
          date: {
            lt: new Date(),
            gt: new Date(new Date(after).getTime() + 24 * 60 * 60 * 1000),
          },
        },
        orderBy: { date: 'asc' },
      });
    }
    if (published === 'false' && after.length > 0) {
      console.log('4, ' + published, after, new Date());
      return await this.prisma.publication.findMany({
        where: {
          date: {
            gt:
              new Date(after) >= new Date()
                ? new Date(new Date(after).getTime() + 24 * 60 * 60 * 1000)
                : new Date(),
          },
        },
        orderBy: { date: 'asc' },
      });
    }
  }

  async getPublications() {
    return await this.prisma.publication.findMany({ orderBy: { date: 'asc' } });
  }

  async getPublication(id: number) {
    return await this.prisma.publication.findFirst({ where: { id } });
  }

  async updatePublication(id: number, data: UpdatePublicationDto) {
    return await this.prisma.publication.update({ where: { id }, data });
  }

  async removePublication(id: number) {
    return await this.prisma.publication.delete({ where: { id } });
  }

  async findMediaIdInPublications(mediaId: number) {
    return await this.prisma.publication.findFirst({ where: { mediaId } });
  }

  async findPostIdInPublications(postId: number) {
    return await this.prisma.publication.findFirst({ where: { postId } });
  }
}
