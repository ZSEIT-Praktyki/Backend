import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Condition } from '../entities/listings.entity';

export class ListingsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  condition: Condition;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  subcategory_id: number;

  @IsString()
  city: string;
}
