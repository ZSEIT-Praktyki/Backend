import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import User from 'src/decorators/User.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { WatchlistDto } from './dto/dto';
import { WatchlistService } from './watchlist.service';

@ApiTags('watchlist')
@UseGuards(AuthGuard)
@Controller('watchlist')
export class WatchlistController {
  constructor(private watchlistService: WatchlistService) {}

  @Get()
  getUserWatchlist(@User() id: number, @Query('skip') skip: number) {
    return this.watchlistService.getRelatedToUser(id, skip);
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
  async deleteWatchlistElement(@Param('watchlist_id') id: number) {
    return this.watchlistService.removeListingFromWatchlist(id).then(({ affected }) => {
      if (affected > 0)
        return {
          statusCode: 200,
          message: 'Deleted',
        };
      throw new BadRequestException();
    });
  }
}
