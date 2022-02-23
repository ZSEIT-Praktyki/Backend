import { Request } from 'express';

export interface BufferRequest extends Request {
  rawBody: Buffer;
}

export interface OrderProps {
  listing_id: any; // typeorm complains
  user_id: any;
  quantity: number;
}
