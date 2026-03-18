import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(username: string, email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    return this.userService.create(username, email, hashed);
  }
  async login(usernameOrEmail: string, password: string) {
    const user = await this.userService.findUser(usernameOrEmail);
    const validate = await bcrypt.compare(password, user.password);
    console.log(user);

    if (!validate) {
      throw new BadRequestException(`Invalid credentials`);
    }
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
