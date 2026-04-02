import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from 'src/entities/follow.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private followRepo: Repository<Follow>,
    private userService: UserService,
  ) {}

  async follow(userId: string, followUserId: string) {
    if (userId === followUserId) {
      throw new BadRequestException('Can not follow yourself');
    }
    const user = await this.userService.findOne(userId);
    const followUser = await this.userService.findOne(followUserId);
    const isAlreadyFollow = await this.followRepo.findOne({
      where: { follower: user, following: followUser },
    });
    if (isAlreadyFollow) {
      throw new BadRequestException('Already followed');
    }
    return this.followRepo.save({ follower: user, following: followUser });
  }

  async getFollower(userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const followers = await this.followRepo.find({
      where: { followingId: user.id },
      relations: ['follower'],
    });

    return followers;
  }

  async getFollowing(userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const following = await this.followRepo.find({
      where: { followerId: user.id },
      relations: ['following'],
    });

    return following;
  }
}
