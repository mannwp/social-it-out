import { Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import type { JwtPayload } from 'src/auth/jwt.strategy';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: JwtPayload) {
    return await this.userService.findUser(user.username);
  }
}
