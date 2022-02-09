import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ListingsModule } from './listings/listings.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, ListingsModule],
})
export class AppModule {}
