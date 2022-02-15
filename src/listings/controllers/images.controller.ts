import {
  BadRequestException,
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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('images')
@Controller('/listings/images')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @ApiOkResponse({ description: 'Returns an image' })
  @ApiBadRequestResponse({
    description: 'Returns 400 if image is broken or doesnt exists',
  })
  @Get('/:filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const file = createReadStream(
      join(process.cwd(), `./upload/${filename}`),
    ).on('error', (err) => console.warn(err));
    return file.pipe(res);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Takes array of images with key: image',
    required: true,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Returns Bad if something went wrong ',
  })
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
      this.imagesService.insertMultiple(files, id).then((res) => {
        if (res.every((v) => v > 0)) {
          return response.status(201).send({
            statusCode: 201,
            images: files.map(({ filename }) => filename),
          });
        } else {
          throw new BadRequestException();
        }
      });
    }
  }
}
