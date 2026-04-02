import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { PostStatus } from 'src/post/enums';
import { PostLike } from './postLike.entity';

@ObjectType()
@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  caption: string;

  @Column({ default: PostStatus.DRAFT })
  @Field(() => PostStatus)
  status: PostStatus;

  @OneToMany(() => PostLike, (like) => like.post)
  likes: PostLike[];

  @Field(() => Int)
  likeCount: number; // resolved via @ResolveField

  @Field()
  isLiked: boolean; // resolved via @ResolveField, needs currentUser from context

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.post)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
