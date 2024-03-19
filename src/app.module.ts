import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ListingsModule } from './listings/listings.module';
import { AppMiddleware } from './app.middleware';
import { OrdersModule } from './orders/orders.module';

import { WatchlistModule } from './watchlist/watchlist.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: 'shop_praktyki',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    ListingsModule,
    OrdersModule,
    WatchlistModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
