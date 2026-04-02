import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Not, Repository } from 'typeorm';
import { CursorPaginationArgs } from 'src/common/dto/cursor-pagination.args';
import { Post } from 'src/entities/post.entity';
import { PostStatus } from 'src/post/enums';

@Injectable()
export class ExploreService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  async getPeople(userId: string, paginationArgs: CursorPaginationArgs) {
    const { after, first } = paginationArgs;

    const queryBuilder = this.userRepo
      .createQueryBuilder('user')
      .where('user.id != :userId', { userId })
      .orderBy('user.id', 'ASC')
      .take(first + 1); // Get one extra to check if there is a next page

    if (after) {
      queryBuilder.andWhere('user.id > :after', { after });
    }

    const items = await queryBuilder.getMany();
    const totalCount = await this.userRepo.count({
      where: { id: Not(userId) },
    });

    const hasNextPage = items.length > first;
    const paginatedItems = hasNextPage ? items.slice(0, first) : items;

    const edges = paginatedItems.map((user) => ({
      node: user,
      cursor: user.id,
    }));

    return {
      edges,
      pageInfo: {
        endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
        hasNextPage,
      },
      totalCount,
    };
  }

  async getPosts(userId: string, paginationArgs: CursorPaginationArgs) {
    const { after, first } = paginationArgs;
    const queryBuilder = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.createdBy', 'user')
      .where('post.createdBy != :userId', { userId })
      .andWhere('post.status = :status', { status: PostStatus.PUBLISHED })
      .orderBy('post.createdAt', 'ASC')
      .take(first + 1);
    if (after) {
      queryBuilder.andWhere('post.id > :after', { after });
    }
    const items = await queryBuilder.getMany();
    const totalCount = await this.postRepo.count({
      where: { createdBy: Not(userId) },
    });
    const hasNextPage = items.length > first;
    const paginatedItems = hasNextPage ? items.slice(0, first) : items;
    const edges = paginatedItems.map((post) => ({
      node: post,
      cursor: post.id,
    }));
    return {
      edges,
      pageInfo: {
        endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
        hasNextPage,
      },
      totalCount,
    };
  }
}
