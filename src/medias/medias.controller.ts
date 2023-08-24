import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { MediasService } from './medias.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Controller('/medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Post()
  createMedia(@Body() body: CreateMediaDto) {
    return this.mediasService.createMedia(body);
  }

  @Get()
  getMedias() {
    return this.mediasService.getMedias();
  }

  @Get(':id')
  getMedia(@Param('id') id: string) {
    return this.mediasService.getMedia(+id);
  }

  @Put(':id')
  updateMedia(@Param('id') id: string, @Body() body: UpdateMediaDto) {
    return this.mediasService.updateMedia(+id, body);
  }

  @Delete(':id')
  deleteMedia(@Param('id') id: string) {
    return this.mediasService.deleteMedia(+id);
  }
}
