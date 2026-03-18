import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  AuthPayload,
  LoginInput,
  RegisterInput,
} from 'src/user/dto/user.input';
import { User } from 'src/entities/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  register(@Args('input') input: RegisterInput) {
    return this.authService.register(
      input.username,
      input.email,
      input.password,
    );
  }

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput) {
    return await this.authService.login(input.usernameOrEmail, input.password);
  }
}
