import { Controller, Get, Param, Query } from '@nestjs/common';

import { ListingsService } from '../services/listings.service';

@Controller('listings')
export class ListingsController {
  constructor(private listingsService: ListingsService) {}

  @Get('/')
  getAllListings(@Query('skip') skip: number) {
    return this.listingsService.getAll(skip);
  }

  @Get('/search')
  getSearched(@Query('query') query: string) {
    return this.listingsService.getByQueryText(query);
  }

  @Get('/:id')
  getListingById(@Param('id') id: number) {
    return this.listingsService.getById(id);
  }
}
