import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Repository } from 'typeorm';
import { Post } from 'src/entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { PostStatus } from './enums';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
    private userService: UserService,
  ) {}
  async create(userId: string, createPostInput: CreatePostInput) {
    const user = await this.userService.findOne(userId);
    const post = this.postRepo.create({
      caption: createPostInput.caption,
      createdBy: user,
      status: createPostInput.status ?? PostStatus.DRAFT,
    });
    return this.postRepo.save(post);
  }

  findAll() {
    return `This action returns all post`;
  }

  async findAllUserPost(userId: string) {
    const user = await this.userService.findOne(userId);
    const posts = await this.postRepo.find({
      where: { createdBy: user },
      relations: ['createdBy'],
    });
    return posts;
  }

  async findOne(id: string) {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post not found ${id}`);
    }
    return post;
  }

  async update(id: string, userId: string, updatePostInput: UpdatePostInput) {
    const user = await this.userService.findOne(userId);
    const post = await this.postRepo.findOne({
      where: { id, createdBy: user },
      relations: ['createdBy'],
    });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    Object.assign(post, updatePostInput);
    return this.postRepo.save(post);
  }

  async remove(id: string, userId: string) {
    const user = await this.userService.findOne(userId);
    const post = await this.postRepo.findOne({
      where: { id, createdBy: user },
    });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    await this.postRepo.softDelete(id);
    return true;
  }
}
