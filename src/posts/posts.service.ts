import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async getPostId(id: number) {
    const postExists = await this.postsRepository.getPost(id);
    if (!postExists) throw new NotFoundException();
    return postExists;
  }

  async createPost(body: CreatePostDto) {
    return await this.postsRepository.createPost(body);
  }

  async getPosts() {
    const returnPosts = await this.postsRepository.getPosts();
    const mapPosts = returnPosts.map(({ image, ...rest }) =>
      image === null ? rest : { ...rest, image },
    );
    return mapPosts;
  }

  async getPost(id: number) {
    const returnPost = await this.getPostId(id);
    if (!returnPost) throw new NotFoundException();
    const { image, ...rest } = returnPost;
    const finalPost = image === null ? rest : { ...rest, image };
    return finalPost;
  }

  async updatePost(id: number, body: UpdatePostDto) {
    const { image, ...rest } = body;
    await this.getPostId(id);

    const returnPost = await this.postsRepository.updatePost(
      id,
      !image ? { ...rest, image: null } : body,
    );
    return returnPost && !returnPost.image ? rest : { ...rest, image };
  }

  async deletePost(id: number) {
    await this.getPostId(id);

    const post = await this.postsRepository.deletePost(id);
    return `O post de ID ${post.id} foi removido com sucesso!`;
  }
}
