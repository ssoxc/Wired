import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/User';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private userRepository!: Repository<User>;

  async getUserGreeting(email: string): Promise<string> {
    console.log(email);
    const user = await this.userRepository.findOne({
      where: { email },
    });
    console.log(user, 'user');
    if (!user) throw new NotFoundException('User not found');
    return `Hello ${user.firstName} ${user.lastName}!`;
  }

  async createUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }
}
