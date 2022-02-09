import { Controller, Get } from '@nestjs/common';
import { ListingsService } from '../services/listings.service';

@Controller('listings')
export class ListingsController {
  constructor(private listingsService: ListingsService) {}
}
