import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsRepository } from './publications.repository';
import { MediasRepository } from '../medias/medias.repository';
import { PostsRepository } from '../posts/posts.repository';

@Injectable()
export class PublicationsService {
  constructor(
    private readonly publicationsRepository: PublicationsRepository,
    private readonly mediasRepository: MediasRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async verifyMediaIdPostId(mediaId: number, postId: number) {
    const mediaIdExists = await this.mediasRepository.getMedia(mediaId);
    const postIdExists = await this.postsRepository.getPost(postId);
    if (!mediaIdExists || !postIdExists) throw new NotFoundException();
  }

  async verifyPublicationId(id: number) {
    const publication = await this.publicationsRepository.getPublication(id);
    if (!publication) throw new NotFoundException();
    return publication;
  }

  async createPublication(body: CreatePublicationDto) {
    const { mediaId, postId } = body;
    await this.verifyMediaIdPostId(mediaId, postId);
    return await this.publicationsRepository.createPublication(body);
  }

  async getPublications() {
    return await this.publicationsRepository.getPublications();
  }

  async getPublication(id: number) {
    return await this.verifyPublicationId(id);
  }

  async updatePublication(id: number, body: UpdatePublicationDto) {
    const publication = await this.verifyPublicationId(id);
    await this.verifyMediaIdPostId(body.mediaId, body.postId);
    if (new Date() >= new Date(publication.date))
      throw new ForbiddenException();
    if (!publication) throw new NotFoundException();
    return await this.publicationsRepository.updatePublication(id, body);
  }

  async removePublication(id: number) {
    await this.verifyPublicationId(id);
    return await this.publicationsRepository.removePublication(id);
  }
}
