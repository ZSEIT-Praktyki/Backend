import { Request } from 'express';

export interface BufferRequest extends Request {
  rawBody: Buffer;
}
