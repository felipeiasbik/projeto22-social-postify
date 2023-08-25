import { Module, forwardRef } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { PublicationsRepository } from './publications.repository';
import { MediasModule } from '../medias/medias.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  controllers: [PublicationsController],
  providers: [PublicationsService, PublicationsRepository],
  imports: [forwardRef(() => MediasModule), forwardRef(() => PostsModule)],
  exports: [PublicationsRepository],
})
export class PublicationsModule {}
