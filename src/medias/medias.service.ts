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
    const titleExists = await this.mediaRepository.findTitleMedia(body.title);
    const usernameExists = await this.mediaRepository.findUsernameMedia(
      body.username,
    );
    return { titleExists, usernameExists };
  }

  async createMedia(body: CreateMediaDto) {
    const { titleExists, usernameExists } = await this.titleUsernameUnics(body);
    if (
      usernameExists !== null ||
      (titleExists !== null && usernameExists !== null)
    )
      throw new ConflictException();

    return this.mediaRepository.createMedia(body);
  }

  async getMedias() {
    return await this.mediaRepository.getMedias();
  }

  async getMedia(id: number) {
    const media = await this.mediaRepository.getMedia(id);
    if (!media) throw new NotFoundException();
    return media;
  }

  async updateMedia(id: number, body: UpdateMediaDto) {
    const mediaExists = await this.getMedia(id);
    if (!mediaExists) throw new NotFoundException();

    const { titleExists, usernameExists } = await this.titleUsernameUnics(body);
    if (
      usernameExists !== null ||
      (titleExists !== null && usernameExists !== null)
    )
      throw new ConflictException();

    return await this.mediaRepository.updateMedia(id, body);
  }

  async deleteMedia(id: number) {
    const mediaExists = await this.getMedia(id);
    if (!mediaExists) throw new NotFoundException();

    return await this.mediaRepository.deleteMedia(id);
  }
}
