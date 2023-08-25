import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediasRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findTitleMedia(title: string, username: string) {
    const titleCurrent = await this.prisma.media.findFirst({
      where: { title },
    });

    if (titleCurrent !== null) {
      return await this.prisma.media.findFirst({
        where: { title: titleCurrent.title, username },
      });
    }

    return titleCurrent;
  }

  async createMedia(data: CreateMediaDto) {
    return await this.prisma.media.create({ data });
  }

  async getMedias() {
    return await this.prisma.media.findMany({ orderBy: { id: 'asc' } });
  }

  async getMedia(id: number) {
    return await this.prisma.media.findFirst({ where: { id } });
  }

  async updateMedia(id: number, data: UpdateMediaDto) {
    return await this.prisma.media.update({ where: { id }, data });
  }

  async deleteMedia(id: number) {
    return await this.prisma.media.delete({ where: { id } });
  }
}
