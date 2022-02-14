import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ListingsService } from '../services/listings.service';

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

  @Get('/category')
  getListingsByCategory(@Query('catId', ParseIntPipe) catId: number) {
    return this.listingsService.getByCategory(catId);
  }

  @Get('/:id') // must be last
  getListingById(@Param('id') id: number) {
    return this.listingsService.getById(id);
  }
}
