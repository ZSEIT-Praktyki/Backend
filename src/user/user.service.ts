import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { UserEntity } from './user.entity';

import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

const SECRET = process.env.JWT_SECRET || 'development';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async checkIfExists(email: string): Promise<boolean> {
    return this.userRepository
      .findOne({
        email,
      })
      .then((response) => {
        if (typeof response !== 'undefined') {
          return true;
        }
        return false;
      });
  }

  createUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<InsertResult> {
    return this.userRepository.insert({ email, password });
  }

  getOneByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ email });
  }

  createJWT<T extends {}>(props: T): string {
    return jwt.sign(props, SECRET, {
      expiresIn: '2d',
    });
  }
  verifyJWT(token: string) {
    return jwt.verify(token, SECRET);
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  comparePassword(password: string, encrypted: string) {
    return bcrypt.compare(password, encrypted);
  }
}
