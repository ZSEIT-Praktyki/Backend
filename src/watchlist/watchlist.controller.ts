import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import User from 'src/decorators/User.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { WatchlistDto } from './dto/dto';
import { WatchlistService } from './watchlist.service';
import { Response } from 'express';

@ApiTags('watchlist')
@UseGuards(AuthGuard)
@Controller('watchlist')
export class WatchlistController {
  constructor(private watchlistService: WatchlistService) {}

  @Get()
  getUserWatchlist(@User() id: number, @Query('skip') skip: number) {
    return this.watchlistService.getRelatedToUser(id, skip);
  }

  @Get('/check')
  async watchlistElementCheck(@User() id: number, @Query('listing_id') listing_id: number) {
    return this.watchlistService.getIfExists(id, listing_id).then((res) => {
      if (typeof res === 'undefined') return { isIn: false };
      return { isIn: true };
    });
  }

  @ApiOkResponse({ description: 'Listing added to watchlist' })
  @ApiBadRequestResponse({ description: '{Error message}' })
  @ApiBody({})
  @Post()
  async addListingToWatchlist(@Body() { listing_id }: WatchlistDto, @User() id: number) {
    try {
      await this.watchlistService.addWatchlistListing(id, listing_id);

      return {
        statusCode: 200,
        message: 'Listing added to watchlist',
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: 400,
        message: error,
      });
    }
  }

  @Delete('/:watchlist_id')
  async deleteWatchlistElement(@Param('watchlist_id') id: number, @User() user_id: number, @Res() response: Response) {
    return this.watchlistService.removeListingFromWatchlist(id, user_id).then((result) => {
      if (result.affected > 0) {
        return response.status(202).send({
          statusCode: 202,
          message: 'Deleted',
        });
      }
    });
  }
}
