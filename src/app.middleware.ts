import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { UserService } from './user/user.service';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  constructor(private usersService: UserService) {}
  use(req: any, _: Response, next: NextFunction) {
    const token = req.cookies['token'];

    if (typeof token !== 'undefined') {
      this.usersService.verifyJWT<{ email: string; id: number }>(JSON.parse(token).token, (err, decoded) => {
        if (err) {
        }
        if (decoded) {
          req.user_id = decoded.id;
        }
      });
    }

    next();
  }
}
