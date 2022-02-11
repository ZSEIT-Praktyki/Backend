import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrderEntity } from './entities/orders.entity';
import { OrdersService } from './orders.service';
import { ReviewsEntity } from './entities/reviews.entity';
import { StatesEntity } from './entities/states.entity';
import { UserAddresses } from './entities/user-addresses.entity';
import { WatchListEntity } from './entities/watchlist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      UserAddresses,
      StatesEntity,
      WatchListEntity,
      ReviewsEntity,
    ]),
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}