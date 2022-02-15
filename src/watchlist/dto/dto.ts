import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class WatchlistDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  listing_id: number;
}
