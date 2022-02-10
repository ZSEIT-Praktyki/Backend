import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface RequestExtend extends Request {
  user_id: number;
}

const User = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as RequestExtend;

  return request.user_id as number;
});

export default User;
