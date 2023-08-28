import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';
import { PublicationsRepository } from '../publications/publications.repository';

@Injectable()
export class MediasService {
  constructor(
    private readonly mediaRepository: MediasRepository,
    private readonly publicationsRepository: PublicationsRepository,
  ) {}

  async titleUsernameUnics(title: string, username: string) {
    const titleUsernameExists = await this.mediaRepository.findTitleMedia(
      title,
      username,
    );
    if (titleUsernameExists !== null) throw new ConflictException();
    return titleUsernameExists;
  }

  async mediaExists(id: number) {
    const media = await this.mediaRepository.getMedia(id);
    if (!media) throw new NotFoundException();
    return media;
  }

  async createMedia(body: CreateMediaDto) {
    await this.titleUsernameUnics(body.title, body.username);
    return this.mediaRepository.createMedia(body);
  }

  async getMedias() {
    return await this.mediaRepository.getMedias();
  }

  async getMedia(id: number) {
    const media = await this.mediaExists(id);
    return media;
  }

  async updateMedia(id: number, body: UpdateMediaDto) {
    await this.mediaExists(id);
    await this.titleUsernameUnics(body.title, body.username);
    return await this.mediaRepository.updateMedia(id, body);
  }

  async deleteMedia(id: number) {
    const mediaInPublications =
      await this.publicationsRepository.findMediaIdInPublications(id);
    if (mediaInPublications) throw new ForbiddenException();
    await this.mediaExists(id);
    return `A rede ${
      (await this.mediaRepository.deleteMedia(id)).title
    } foi deletada.`;
  }
}
