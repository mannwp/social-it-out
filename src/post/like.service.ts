import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostService } from './post.service';
import { PostLike } from 'src/entities/postLike.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(PostLike)
    private likeRepo: Repository<PostLike>,
    private postService: PostService,
  ) {}

  async toggle(userId: string, postId: string): Promise<boolean> {
    const post = await this.postService.findOne(postId);

    const existing = await this.likeRepo.findOne({
      where: { userId, postId: post.id },
    });

    if (existing) {
      await this.likeRepo.delete({ userId, postId });
      return false; // unliked
    }

    await this.likeRepo.save({ userId, postId });
    return true; // liked
  }

  countByPost(postId: string): Promise<number> {
    return this.likeRepo.count({ where: { postId } });
  }

  async isLiked(userId: string, postId: string): Promise<boolean> {
    const count = await this.likeRepo.count({ where: { userId, postId } });
    return count > 0;
  }
}
