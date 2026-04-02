import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class Follow {
  @PrimaryColumn()
  @Field(() => ID)
  followingId: string;

  @PrimaryColumn()
  @Field(() => ID)
  followerId: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column({ default: true })
  notificationsEnabled: boolean;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.following)
  @JoinColumn({ name: 'followingId' })
  following: User;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.follower)
  @JoinColumn({ name: 'followerId' })
  follower: User;
}
