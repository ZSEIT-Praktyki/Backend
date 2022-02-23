import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Put,
  Param,
  ParseIntPipe,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import User from '../../decorators/User.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response } from 'express';
import { ListingsDto } from '../dto/Listings.dto';
import { ManagmentService } from '../services/managment.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('managment')
@Controller('/listings/managment')
export class ManagmentController {
  constructor(private managmentService: ManagmentService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createListing(@Body() props: ListingsDto, @User() id: number, @Res() response: Response) {
    try {
      const { raw } = await this.managmentService.insertListing({ ...props, seller_id: id });
      if (raw.affected === 0 || raw.affectedRows === 0) {
        throw new BadRequestException();
      }

      response.status(201).send({
        statusCode: 201,
        listing_id: raw.insertId,
        message: 'Listing created successfully',
      });
    } catch (error) {
      console.warn(error);
      throw new BadRequestException();
    }
  }

  @Put('/archive/:listing_id')
  @UseGuards(AuthGuard)
  async archiveListing(@User() seller_id: number, @Param('listing_id') listing_id: number, @Res() response: Response) {
    try {
      await this.managmentService.hasPermission(seller_id, listing_id);
      await this.managmentService.archivizeListing(listing_id);
      return response.status(200).send({
        statusCode: 200,
        message: 'Success',
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Put('/:listing_id') // can only update title, desc,price,quantity, and in future images
  @UseGuards(AuthGuard)
  async updateListing(
    @Param('listing_id', ParseIntPipe) listing_id: number,
    @Body() props: any,
    @User() seller_id: number,
    @Res() response: Response,
  ) {
    try {
      await this.managmentService.hasPermission(seller_id, listing_id);
      const { affected } = await this.managmentService.updateFieldsByKeys(listing_id, props);
      if (affected > 0) {
        return response.send({
          statusCode: 200,
          message: 'updated',
        });
      }
      throw new BadRequestException();
    } catch (error) {
      throw new ForbiddenException();
    }
  }
}
