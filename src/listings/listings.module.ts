import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingsImagesEntity } from './entities/listings-images.entity';
import { ListingsEntity } from './entities/listings.entity';
import { ListingsController } from './controllers/listings.controller';
import { ListingsService } from './services/listings.service';
import { SubcategoriesEntity } from './entities/subcategories.entity';
import { CategoriesEntity } from './entities/categories.entity';
import { ImagesController } from './controllers/images.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ListingsImagesEntity,
      ListingsEntity,
      SubcategoriesEntity,
      CategoriesEntity,
    ]),
  ],
  controllers: [ListingsController, ImagesController],
  providers: [ListingsService],
})
export class ListingsModule {}
