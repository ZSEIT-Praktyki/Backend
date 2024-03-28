import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto, UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { Response } from 'express';
import { invalidInput, loginResponse } from './user.response';
import * as dayjs from 'dayjs';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import User from 'src/decorators/User.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOkResponse({
    description: 'sends cookie back with some successfull message',
  })
  @ApiBadRequestResponse({ description: 'Return bad response with reason' })
  @Post('/login')
  async loginUser(@Body() { email, password }: UserDto, @Res() response: Response) {
    try {
      const user = await this.userService.getOneByEmail(email);

      if (!user)
        return response.status(HttpStatus.BAD_REQUEST).send({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User with that email does not exist',
        });

      const matched = await this.userService.comparePassword(password, user.password);

      if (!matched) return response.status(HttpStatus.BAD_REQUEST).send(invalidInput);

      const token = this.userService.createJWT({ id: user.id });

      response
        .cookie('token', JSON.stringify({ token }), {
          httpOnly: true,
          expires: dayjs().add(3, 'days').toDate(),
          path: '/',
          sameSite: 'strict',
        })
        .status(HttpStatus.OK)
        .send(loginResponse);
    } catch (error) {
      throw new NotFoundException(`Couldn't find account with ${email} email`);
    }
  }

  @ApiCreatedResponse({
    description: 'sends cookie back with some successfull message',
  })
  @ApiBadRequestResponse({ description: 'Return bad response with reason' })
  @Post('/register')
  async registerUser(@Body() { email, password, name, phone, surname }: RegisterDto, @Res() response: Response) {
    const exists = await this.userService.checkIfExists(email);

    if (exists) {
      throw new BadRequestException('User with that email already exists');
    }
    try {
      const hashed = await this.userService.hashPassword(password);

      const { raw } = await this.userService.createUser({
        email,
        password: hashed,
        name,
        surname,
        phone,
      });

      if (raw.affectedRows <= 0)
        return response.status(HttpStatus.BAD_REQUEST).send({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Something went wrong',
        });

      const token = this.userService.createJWT({
        id: raw.insertId,
      });

      response
        .cookie('token', JSON.stringify({ token }), {
          httpOnly: true,
          expires: dayjs().add(3, 'days').toDate(),
          path: '/',
          sameSite: 'strict',
        })
        .status(HttpStatus.CREATED)
        .send(loginResponse);
    } catch (error) {
      throw new BadRequestException('Someting went wrong');
    }
  }

  @Post('/cookie')
  @UseGuards(AuthGuard)
  reedemCookie(@User() id: number, @Res() response: Response) {
    const token = this.userService.createJWT({ id });

    response
      .cookie('token', JSON.stringify({ token }), {
        httpOnly: true,
        expires: dayjs().add(3, 'days').toDate(),
        path: '/',
        sameSite: 'strict',
      })
      .send({
        statusCode: HttpStatus.OK,
        message: 'cookie set',
      });
  }

  @Get('/credentials')
  getUserCredentials(@User() id: number) {
    return this.userService.getCredentials(id);
  }

  @Post('/signout')
  signout(@Res() response: Response) {
    return response
      .clearCookie('token', {
        httpOnly: true,
      })
      .end();
  }
}
