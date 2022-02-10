import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from './user/user.service';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  constructor(private usersService: UserService) {}
  use(req: any, res: Response, next: NextFunction) {
    const token = req.headers['token'];

    if (typeof token !== 'undefined') {
      this.usersService.verifyJWT<{ email: string; id: number }>(
        token as string,
        (err, decoded) => {
          if (err) {
          }
          if (decoded) {
            req.user_id = decoded.id;
          }
        },
      );
    }

    next();
  }
}
