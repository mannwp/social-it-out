import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Int,
  Parent,
} from '@nestjs/graphql';
import { PostService } from './post.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from 'src/entities/post.entity';
import { CurrentUser } from 'src/auth/current-user.decorator';
import type { JwtPayload } from 'src/auth/jwt.strategy';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { LikeService } from './like.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly likeService: LikeService,
  ) {}

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async createPost(
    @CurrentUser() user: JwtPayload,
    @Args('createPostInput') createPostInput: CreatePostInput,
  ) {
    return await this.postService.create(user.sub, createPostInput);
  }
  @Query(() => [Post], { name: 'userPosts' })
  @UseGuards(GqlAuthGuard)
  findAllUserPost(@CurrentUser() user: JwtPayload) {
    return this.postService.findAllUserPost(user.sub);
  }
  @Query(() => [Post], { name: 'post' })
  findAll() {
    return this.postService.findAll();
  }

  @Query(() => Post, { name: 'post' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.postService.findOne(id);
  }

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  updatePost(
    @CurrentUser() user: JwtPayload,
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
  ) {
    return this.postService.update(
      updatePostInput.id,
      user.sub,
      updatePostInput,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removePost(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.postService.remove(id, user.sub);
  }

  @ResolveField(() => Int)
  likeCount(@Parent() post: Post): Promise<number> {
    return this.likeService.countByPost(post.id);
  }

  @ResolveField(() => Boolean)
  isLiked(
    @CurrentUser() user: JwtPayload,
    @Parent() post: Post,
  ): Promise<boolean> {
    return this.likeService.isLiked(user.sub, post.id);
  }
}
