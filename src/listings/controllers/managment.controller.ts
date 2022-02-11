import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import User from '../../decorators/User.decorator';
import { ListingsService } from '../services/listings.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response } from 'express';
import { ListingsDto } from '../dto/Listings.dto';

@Controller('/listings/managment')
export class ManagmentController {
  constructor(private listingsService: ListingsService) {}

  @Post()
  @UseGuards(AuthGuard)
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
