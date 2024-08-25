import { Body, Controller, Post } from '@nestjs/common';
import { CreateUser, UsersService } from './users.service';
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/create')
  //   handles the post request to /users/create endpoint to create new user
  async signUp(@Body() user: CreateUser) {
    return await this.userService.createUser(user);
  }
}
