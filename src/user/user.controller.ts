import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { Response } from 'express';
import {
  invalidInput,
  loginResponse,
  userExistsError,
  userNotFound,
  userRegistered,
} from './user.response';
import * as dayjs from 'dayjs';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/login')
  async loginUser(
    @Body() { email, password }: UserDto,
    @Res() response: Response,
  ) {
    this.userService.getOneByEmail(email).then((user) => {
      if (typeof user === 'undefined') {
        return response.status(404).send(userNotFound);
      }

      this.userService
        .comparePassword(password, user.password)
        .then((matches) => {
          if (!matches) {
            return response.status(400).send(invalidInput);
          }
          const jwt = this.userService.createJWT({ email, id: user.id });

          response.cookie('token', JSON.stringify({ token: jwt }), {
            secure: process.env.NODE_ENV !== 'development',
            httpOnly: true,
            expires: dayjs().add(1, 'days').toDate(),
          });

          response.send(loginResponse);
        });
    });
  }

  @Post('/register')
  registerUser(
    @Body() { email, password }: UserDto,
    @Res() response: Response,
  ) {
    this.userService.checkIfExists(email).then((exists) => {
      if (exists) {
        return response.status(400).send(userExistsError);
      }
      this.userService.hashPassword(password).then((hashed) => {
        this.userService
          .createUser({ email, password: hashed })
          .then(({ raw }) => {
            if (raw.affectedRows > 0) {
              return response.status(201).send(userRegistered);
            }
          });
      });
    });
  }
}