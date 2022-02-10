import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListingsImagesEntity } from '../entities/listings-images.entity';

interface ImageProps {
  listing_id: number;
  filename: string;
  order: number;
}

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ListingsImagesEntity)
    private imagesRepository: Repository<ListingsImagesEntity>,
  ) {}

  async insertOne(props: ImageProps): Promise<number> {
    return this.imagesRepository
      .insert(props)
      .then(({ raw }) => raw.affectedRows);
  }
}
