import { Module } from '@nestjs/common';
import { ExploreService } from './explore.service';
import { ExploreResolver } from './explore.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { Post } from 'src/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post]), UserModule],
  providers: [ExploreService, ExploreResolver],
})
export class ExploreModule {}
