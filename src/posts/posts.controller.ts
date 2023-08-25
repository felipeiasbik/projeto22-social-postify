import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async createPost(@Body() body: CreatePostDto) {
    return await this.postsService.createPost(body);
  }

  @Get()
  async getPosts() {
    return await this.postsService.getPosts();
  }

  @Get(':id')
  async getPost(@Param('id') id: string) {
    return await this.postsService.getPost(+id);
  }

  @Put(':id')
  async updatePost(@Param('id') id: string, @Body() body: UpdatePostDto) {
    return await this.postsService.updatePost(+id, body);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return await this.postsService.deletePost(+id);
  }
}
