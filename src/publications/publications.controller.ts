import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Post()
  async createPublication(@Body() body: CreatePublicationDto) {
    return await this.publicationsService.createPublication(body);
  }

  @Get()
  async getPublications() {
    return await this.publicationsService.getPublications();
  }

  @Get(':id')
  async getPublication(@Param('id') id: string) {
    return await this.publicationsService.getPublication(+id);
  }

  @Put(':id')
  async updatePublication(
    @Param('id') id: string,
    @Body() body: UpdatePublicationDto,
  ) {
    return this.publicationsService.updatePublication(+id, body);
  }

  @Delete(':id')
  async removePublication(@Param('id') id: string) {
    return await this.publicationsService.removePublication(+id);
  }
}
