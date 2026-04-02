import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  async findOne(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }
  async findOneByUsername(username: string) {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User ${username} not found`);
    }
    return user;
  }
  async create(username: string, email: string, hashedPassword: string) {
    const usernameExists = await this.userRepo.findOne({ where: { username } });
    if (usernameExists) {
      throw new ConflictException(`Username '${username}' is already used`);
    }
    const user = this.userRepo.create({
      username,
      email,
      password: hashedPassword,
    });
    return this.userRepo.save(user);
  }
  async findUser(usernameOrEmail: string) {
    console.log(usernameOrEmail);

    let user = await this.userRepo.findOne({
      where: { username: usernameOrEmail },
    });
    console.log(user);

    if (!user) {
      const userByEmail = await this.userRepo.findOne({
        where: { email: usernameOrEmail },
      });
      if (userByEmail) {
        user = userByEmail;
      }
    }
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }
}
