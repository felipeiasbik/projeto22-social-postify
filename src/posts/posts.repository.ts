import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(data: CreatePostDto) {
    return await this.prisma.post.create({
      data,
    });
  }

  async getPosts() {
    return await this.prisma.post.findMany({ orderBy: { id: 'asc' } });
  }

  async getPost(id: number) {
    return await this.prisma.post.findFirst({ where: { id } });
  }

  async updatePost(id: number, data: UpdatePostDto) {
    return await this.prisma.post.update({ where: { id }, data });
  }

  async deletePost(id: number) {
    return await this.prisma.post.delete({ where: { id } });
  }
}
