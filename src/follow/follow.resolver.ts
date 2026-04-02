import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FollowService } from './follow.service';
import { Follow } from 'src/entities/follow.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import type { JwtPayload } from 'src/auth/jwt.strategy';
import { FollowInput } from 'src/user/dto/user.input';

@Resolver()
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @Mutation(() => Follow)
  @UseGuards(GqlAuthGuard)
  async follow(
    @CurrentUser() user: JwtPayload,
    @Args('input') input: FollowInput,
  ) {
    return await this.followService.follow(user.sub, input.targetId);
  }

  @Query(() => [Follow])
  @UseGuards(GqlAuthGuard)
  async userFollowers(@CurrentUser() user: JwtPayload) {
    return await this.followService.getFollower(user.sub);
  }

  @Query(() => [Follow])
  @UseGuards(GqlAuthGuard)
  async userFollowing(@CurrentUser() user: JwtPayload) {
    return await this.followService.getFollowing(user.sub);
  }
}
