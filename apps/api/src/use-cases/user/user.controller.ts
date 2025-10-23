import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../entities/User';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getGreeting(@Query('email') email: string): Promise<string> {
    if (!email) {
      return 'Email is required';
    }
    return this.userService.getUserGreeting(email);
  }

  @Post()
  async createUser(@Body() user: User): Promise<User> {
    return this.userService.createUser(user);
  }
}
