import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingsImagesEntity } from './entities/listings-images.entity';
import { ListingsEntity } from './entities/listings.entity';
import { ListingsController } from './controllers/listings.controller';
import { ListingsService } from './services/listings.service';
import { SubcategoriesEntity } from './entities/subcategories.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ListingsImagesEntity,
      ListingsEntity,
      SubcategoriesEntity,
    ]),
  ],
  controllers: [ListingsController],
  providers: [ListingsService],
})
export class ListingsModule {}
