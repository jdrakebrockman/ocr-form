import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AppService } from './app.service';
import * as tesseract from 'node-tesseract-ocr';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getOcrViaUrl() {
    const img = 'https://tesseract.projectnaptha.com/img/eng_bw.png';
    const text = await tesseract.recognize(img);
    return text;
  }

  @Post('ocr')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // const img = 'https://tesseract.projectnaptha.com/img/eng_bw.png';
    console.log(file);
    const text = await tesseract.recognize(file.buffer);
    return text;
  }
}
