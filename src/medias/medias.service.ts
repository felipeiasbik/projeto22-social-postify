import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';

@Injectable()
export class MediasService {
  constructor(private readonly mediaRepository: MediasRepository) {}

  async titleUsernameUnics(body: CreateMediaDto) {
    const titleUsernameExists = await this.mediaRepository.findTitleMedia(
      body.title,
      body.username,
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
    await this.titleUsernameUnics(body);
    return this.mediaRepository.createMedia(body);
  }

  async getMedias() {
    return await this.mediaRepository.getMedias();
  }

  async getMedia(id: number) {
    const media = await this.mediaExists(id);
    console.log(media);
    return media;
  }

  async updateMedia(id: number, body: UpdateMediaDto) {
    await this.mediaExists(id);
    await this.titleUsernameUnics(body);
    return await this.mediaRepository.updateMedia(id, body);
  }

  async deleteMedia(id: number) {
    await this.mediaExists(id);
    return `A rede ${
      (await this.mediaRepository.deleteMedia(id)).title
    } foi deletada.`;
  }
}
