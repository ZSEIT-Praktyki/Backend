import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingsImagesEntity } from './entities/listings-images.entity';
import { ListingsEntity } from './entities/listings.entity';
import { ListingsController } from './controllers/listings.controller';
import { ListingsService } from './services/listings.service';
import { SubcategoriesEntity } from './entities/subcategories.entity';
import { CategoriesEntity } from './entities/categories.entity';
import { ImagesController } from './controllers/images.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ImagesService } from './services/images.service';
import { ManagmentController } from './controllers/managment.controller';
import { ManagmentService } from './services/managment.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
    }),
    TypeOrmModule.forFeature([ListingsImagesEntity, ListingsEntity, SubcategoriesEntity, CategoriesEntity]),
  ],
  controllers: [ListingsController, ImagesController, ManagmentController],
  providers: [ListingsService, ImagesService, ManagmentService],
  exports: [ListingsService, ManagmentService],
})
export class ListingsModule {}
