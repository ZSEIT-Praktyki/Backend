import { Condition } from './entities/listings.entity';

export interface ListingProps {
  title: string;
  description: string;
  condition: Condition;
  price: number;
  quantity: number;
  seller_id: any;
  subcategory_id: number;
}
