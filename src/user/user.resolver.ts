import { Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/entities/user.entity';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me() {
    return await this.userService.findUser('mann');
  }
}
