import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediasRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findTitleMedia(title: string) {
    return await this.prisma.media.findFirst({ where: { title } });
  }

  async findUsernameMedia(username: string) {
    return await this.prisma.media.findFirst({ where: { username } });
  }

  async createMedia(data: CreateMediaDto) {
    return await this.prisma.media.create({ data });
  }

  async getMedias() {
    return await this.prisma.media.findMany();
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
