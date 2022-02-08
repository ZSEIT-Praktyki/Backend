import { HttpStatus } from '@nestjs/common';

export const userNotFound = {
  statusCode: HttpStatus.NOT_FOUND,
  message: 'Account not found',
};

export const invalidInput = {
  statusCode: HttpStatus.BAD_REQUEST,
  message: 'Email or password is invalid',
};

export const loginResponse = {
  statusCode: HttpStatus.OK,
  message: 'Success',
};

export const userExistsError = {
  statusCode: HttpStatus.BAD_REQUEST,
  message: 'Account already exists',
};

export const userRegistered = {
  statusCode: HttpStatus.CREATED,
  message: 'Account created Successfully',
};
