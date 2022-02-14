import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { Response } from 'express';
import {
  invalidInput,
  loginResponse,
  userExistsError,
  userNotFound,
} from './user.response';
import * as dayjs from 'dayjs';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOkResponse({
    description: 'sends cookie back with some successfull message',
  })
  @ApiBadRequestResponse({ description: 'Return bad response with reason' })
  @Post('/login')
  async loginUser(
    @Body() { email, password }: UserDto,
    @Res() response: Response,
  ) {
    this.userService.getOneByEmail(email).then((user) => {
      if (typeof user === 'undefined') {
        return response.status(400).send(userNotFound);
      }

      this.userService
        .comparePassword(password, user.password)
        .then((matches) => {
          if (!matches) {
            return response.status(400).send(invalidInput);
          }
          const jwt = this.userService.createJWT({ email, id: user.id });

          response
            .cookie('token', JSON.stringify({ token: jwt }), {
              httpOnly: true,
              expires: dayjs().add(1, 'days').toDate(),
            })
            .status(200)
            .send({ ...loginResponse });
        });
    });
  }

  @ApiCreatedResponse({
    description: 'sends cookie back with some successfull message',
  })
  @ApiBadRequestResponse({ description: 'Return bad response with reason' })
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
              const jwt = this.userService.createJWT({
                email,
                id: raw.insertId,
              });

              response
                .cookie('token', JSON.stringify({ token: jwt }), {
                  httpOnly: true,
                  expires: dayjs().add(1, 'days').toDate(),
                })
                .status(200)
                .send({ ...loginResponse });
            }
          });
      });
    });
  }
}
