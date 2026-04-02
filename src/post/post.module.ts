import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { UserModule } from 'src/user/user.module';
import { PostLike } from 'src/entities/postLike.entity';
import { LikeService } from './like.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostLike]), UserModule],
  providers: [PostResolver, PostService, LikeService],
})
export class PostModule {}
