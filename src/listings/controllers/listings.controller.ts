import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  Res,
  UseFilters,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ListingsService } from '../services/listings.service';
import { Response } from 'express';
import { HttpErrorFilter } from 'src/filters/HttpErrorFilter';

@UseFilters(HttpErrorFilter)
@ApiTags('listings')
@Controller('listings')
export class ListingsController {
  constructor(private listingsService: ListingsService) {}

  @ApiOkResponse({
    description: 'Returns Array of objects containing listings',
  })
  @Get('/')
  getAllListings(@Query('skip') skip: number) {
    return this.listingsService.getAll(skip);
  }

  @ApiOkResponse({
    description:
      'Returns Array of objects containing listings matching query param',
  })
  @Get('/search')
  getSearched(@Query('query') query: string) {
    return this.listingsService.getByQueryText(query);
  }

  @Get('/subcategory')
  getLisingBySubCategory(@Query('subCatId', ParseIntPipe) subCatId: number) {
    return this.listingsService.getbySubCategory(subCatId);
  }

  @Get('/seller/:seller_id')
  getSellerListings(@Param('seller_id', ParseIntPipe) seller_id: number) {
    return this.listingsService.getSellerListings(seller_id);
  }

  @Get('/category')
  getListingsByCategory(@Query('catId', ParseIntPipe) catId: number) {
    return this.listingsService.getByCategory(catId);
  }

  @Get('/:id') // must be last
  async getListingById(@Param('id') id: number, @Res() response: Response) {
    try {
      const res = await this.listingsService.getById(id);
      return response.send(res);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
