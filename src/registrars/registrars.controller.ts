import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { RegistrarsService } from './registrars.service';
import { Prisma } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

@Controller('registrars')
export class RegistrarsController {
  constructor(private readonly registrarsService: RegistrarsService) {}

  @Post()
  create(@Body() data: Prisma.RegistrarCreateInput) {
    return this.registrarsService.create(data);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('featured') featured?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
  ) {
    const where: Prisma.RegistrarWhereInput = {};
    if (status && status !== 'all') where.status = status;
    if (featured === 'true') where.featured = true;
    if (featured === 'false') where.featured = false;
    if (type && type !== 'all') where.type = type;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }
    return this.registrarsService.findAll({ where });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registrarsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.RegistrarUpdateInput) {
    return this.registrarsService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registrarsService.remove(+id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = './uploads/registrars';
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4();
        const ext = extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|svg\+xml)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    }
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return {
      url: `/uploads/registrars/${file.filename}`
    };
  }
}
