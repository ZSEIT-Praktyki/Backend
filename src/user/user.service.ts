import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { UserEntity } from './user.entity';

import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export const SECRET = process.env.JWT_SECRET || 'development';

interface CreateProps {
  email: string;
  password: string;
  name: string;
  surname: string;
  phone: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async checkIfExists(email: string): Promise<boolean> {
    return this.userRepository
      .findOne({
        where: {
          email,
        },
        select: ['id'],
      })
      .then((response) => {
        if (typeof response !== 'undefined') {
          return true;
        }
        return false;
      });
  }

  createUser(props: CreateProps): Promise<InsertResult> {
    return this.userRepository.insert({
      ...props,
      owners_name: props.name,
      owners_phone: props.phone,
      owners_surname: props.surname,
    });
  }

  getOneByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOneOrFail({
      where: {
        email,
      },
      select: ['password', 'id', 'email'],
    });
  }

  createJWT<T extends { id: number }>(props: T): string {
    return jwt.sign(props, SECRET, {
      expiresIn: '2d',
    });
  }
  verifyJWT<T>(token: string, fn: (err: unknown, decoded: T) => void) {
    return jwt.verify(token, SECRET, fn);
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  comparePassword(password: string, encrypted: string) {
    return bcrypt.compare(password, encrypted);
  }

  getCredentials(user_id: number) {
    return this.userRepository.findOne(user_id);
  }

  async addIncome(user_id: number, increment: number) {
    return this.userRepository.update({ id: user_id }, { income: () => `income + ${increment}` });
  }
}
