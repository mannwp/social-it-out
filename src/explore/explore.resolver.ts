import { Args, Query, Resolver, ObjectType } from '@nestjs/graphql';
import { ExploreService } from './explore.service';
import { User } from 'src/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import type { JwtPayload } from 'src/auth/jwt.strategy';
import { CursorPaginationArgs } from 'src/common/dto/cursor-pagination.args';
import { CursorPaginated } from 'src/common/dto/cursor-paginated-response';
import { Post } from 'src/entities/post.entity';

@ObjectType()
class CursorPaginatedUsers extends CursorPaginated(User) {}

@ObjectType()
class CursorPaginatedPosts extends CursorPaginated(Post) {}

@Resolver()
export class ExploreResolver {
  constructor(private readonly exploreService: ExploreService) {}
  @Query(() => CursorPaginatedUsers)
  @UseGuards(GqlAuthGuard)
  async explorePeople(
    @CurrentUser() user: JwtPayload,
    @Args() paginationArgs: CursorPaginationArgs,
  ): Promise<CursorPaginatedUsers> {
    return await this.exploreService.getPeople(user.sub, paginationArgs);
  }

  @Query(() => CursorPaginatedPosts)
  @UseGuards(GqlAuthGuard)
  async explorePosts(
    @CurrentUser() user: JwtPayload,
    @Args() paginationArgs: CursorPaginationArgs,
  ): Promise<CursorPaginatedPosts> {
    return await this.exploreService.getPosts(user.sub, paginationArgs);
  }
}
