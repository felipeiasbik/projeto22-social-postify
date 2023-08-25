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

  async getPublications() {
    return await this.prisma.publication.findMany({ orderBy: { id: 'asc' } });
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
