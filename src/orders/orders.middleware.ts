import { json } from 'body-parser';
import { ServerResponse } from 'http';
import { BufferRequest } from './orders.interface';

export function rawOrdersMiddleware() {
  return json({
    verify: (req: BufferRequest, res: ServerResponse, buffer: Buffer) => {
      if (req.url === '/orders/webhook' && Buffer.isBuffer(buffer)) {
        req.rawBody = Buffer.from(buffer);
      }
      return true;
    },
  });
}
