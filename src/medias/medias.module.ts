import { Module, forwardRef } from '@nestjs/common';
import { MediasService } from './medias.service';
import { MediasController } from './medias.controller';
import { MediasRepository } from './medias.repository';
import { PublicationsModule } from '../publications/publications.module';

@Module({
  controllers: [MediasController],
  providers: [MediasService, MediasRepository],
  imports: [forwardRef(() => PublicationsModule)],
  exports: [MediasRepository],
})
export class MediasModule {}
