import { IsNotEmpty, IsNumber, IsPositive, IsString, Length } from 'class-validator';
import { Condition } from '../entities/listings.entity';

export class ListingsDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 60)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  condition: Condition;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  subcategory_id: number;

  @IsNotEmpty()
  @IsString()
  city: string;
}
