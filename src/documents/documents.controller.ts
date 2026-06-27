import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/documents.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import type { Response } from 'express';

const storage = diskStorage({
  destination: './uploads/documents',
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4() + extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
    fileFilter: (req, file, cb) => {
      const allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ];
      if (!allowedMimes.includes(file.mimetype)) {
        return cb(new BadRequestException('Type de fichier non autorisé (PDF, DOC/X, XLS/X, PPT/X uniquement).'), false);
      }
      cb(null, true);
    },
  }))
  create(
    @Body() createDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    if (!file) throw new BadRequestException('Le fichier est obligatoire.');
    return this.documentsService.create(createDto, file, req.user.userId);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('status') status?: string,
  ) {
    const skip = (Number(page) - 1) * Number(limit);
    return this.documentsService.findAll({ skip, take: Number(limit), search, category, status });
  }

  @Get('download/:id')
  async download(@Param('id') id: string, @Res() res: Response) {
    const doc = await this.documentsService.incrementDownload(+id);
    return res.redirect(doc.file_url);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', {
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
    fileFilter: (req, file, cb) => {
      const allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ];
      if (!allowedMimes.includes(file.mimetype)) {
        return cb(new BadRequestException('Type de fichier non autorisé.'), false);
      }
      cb(null, true);
    },
  }))
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    return this.documentsService.update(+id, updateDto, file, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.documentsService.remove(+id, req.user.userId);
  }
}
