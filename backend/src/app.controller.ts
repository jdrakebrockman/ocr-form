import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AppService } from './app.service';
import * as tesseract from 'node-tesseract-ocr';

@Controller()
export class AppController {
  links = {};

  constructor(private readonly appService: AppService) {}

  @Post('ocr/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Param('id') id) {
    // const img = 'https://tesseract.projectnaptha.com/img/eng_bw.png';
    console.log(file);
    const text = await tesseract.recognize(file.buffer);

    this.links[id] = text;

    return text;
  }

  @Get('link')
  async getLink() {
    let r = this.generateHash();
    let safe = false;

    while (!safe) {
      if (this.links[r]) {
        r = this.generateHash();
      } else {
        safe = true;
      }
    }

    return r;
  }

  @Get('link/:id')
  async getLinkById(@Param('id') id) {
    if (this.links[id]) {
      const value = this.links[id];
      delete this.links[id];

      return value;
    }

    return null;
  }

  private generateHash() {
    return (Math.random() + 1).toString(36).substring(7);
  }
}
