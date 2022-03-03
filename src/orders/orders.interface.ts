import { Request } from 'express';

export interface BufferRequest extends Request {
  rawBody: Buffer;
}

export interface OrderProps {
  listing_id: any; // typeorm complains
  user_id: any;
  quantity: number;
  address_id: number;
}

export interface AddressProps {
  name: string;
  surname: string;
  street: string;
  street_number: string;
  postal_code: string;
  city: string;
  phone: string;
  state: string;
  user_id: any;
}
