import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import User from 'src/decorators/User.decorator';
import { ListingsDto } from '../dto/Listings.dto';
import { CreateGuard } from '../listings.guard';
import { ListingsService } from '../services/listings.service';
import { Response } from 'express';

@Controller('listings')
export class ListingsController {
  constructor(private listingsService: ListingsService) {}

  @Get('/')
  getAllListings() {
    return this.listingsService.getAll();
  }

  @Get('/:id')
  getListingById(@Param('id') id: number) {
    return this.listingsService.getById(id);
  }

  @Post()
  @UseGuards(CreateGuard)
  async createListing(
    @Body() props: ListingsDto,
    @User() id: number,
    @Res() response: Response,
  ) {
    this.listingsService
      .insertListing({ ...props, seller_id: id })
      .then((succ) => {
        if (!succ) {
          return response.status(400).send({
            statusCode: 400,
            message: 'Something went wrong try again',
          });
        }
        response.status(201).send({
          statusCode: 201,
          message: 'Listing created successfully',
        });
      })
      .catch(console.warn);
  }
}
