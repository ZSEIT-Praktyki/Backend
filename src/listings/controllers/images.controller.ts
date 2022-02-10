import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImagesService } from '../services/images.service';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('/listings/images')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @Get('/:filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const file = createReadStream(
      join(process.cwd(), `./upload/${filename}`),
    ).on('error', (err) => console.warn(err));
    return file.pipe(res);
  }

  @Post(':listing_id')
  @UseInterceptors(
    FilesInterceptor('image', 9, {
      dest: './upload',
    }),
  )
  uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('listing_id') id: number,
    @Res() response: Response,
  ) {
    if (files) {
      const mapped = files.map(({ filename }, i) =>
        this.imagesService.insertOne({
          filename,
          listing_id: id,
          order: i,
        }),
      );
      Promise.all(mapped).then((res) => {
        if (res.every((v) => v > 0)) {
          return response.status(201).send({
            statusCode: 201,
            images: files.map(({ filename }) => filename),
          });
        } else {
          response.status(400).send({
            statusCode: 400,
            error: 'Something went wrong',
          });
        }
      });
    }
  }
}
