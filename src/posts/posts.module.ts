import { Module, forwardRef } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PublicationsModule } from '../publications/publications.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
  exports: [PostsRepository],
  imports: [forwardRef(() => PublicationsModule)],
})
export class PostsModule {}
