import {
  BadRequestException,
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
  getAllListings(@Query('page') page: number) {
    return this.listingsService.getAll(page);
  }

  @ApiOkResponse({ description: 'Returns all prods ids' })
  @Get('/ids')
  getAllProductsIds() {
    return this.listingsService.getAllIds();
  }

  @ApiOkResponse({
    description: 'Returns Array of objects containing listings matching query param',
  })
  @Get('/search')
  async getSearched(
    @Query('query') query: string,
    @Query('page') page: number,
    @Query('min') min: number = 0,
    @Query('max') max: number = 9999 * 100,
    @Query('subcategory_id') subcategory_id: number,
    @Query('sort') sort: string,
    @Query('city') city: string,
  ) {
    try {
      const res = await this.listingsService.getByQueryText({
        query,
        page,
        min: min,
        max: max,
        order: sort,
        subcategory_id,
        city,
      });
      return res;
    } catch (error) {
      console.log(error);
      throw new BadRequestException({
        error,
      });
    }
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

  @Get('/subcategories')
  getSubcategories() {
    return this.listingsService.subcategories();
  }

  @Get('/preview/:id')
  getPreview(@Param('id') id: number) {
    return this.listingsService.getPreview(id);
  }

  @Get('/:id') // must be last
  async getListingById(@Param('id') id: number, @Res() response: Response) {
    try {
      const res = await this.listingsService.getListingById(id);
      return response.send(res);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
