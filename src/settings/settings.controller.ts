import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

const storageConfig = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads/settings';
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
});

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @Patch()
  async updateSettings(@Body() data: any) {
    return this.settingsService.updateSettings(data);
  }

  @Post('upload/logo')
  @UseInterceptors(FileInterceptor('file', {
    storage: storageConfig,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|svg\+xml|x-icon)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    }
  }))
  async uploadLogo(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');
    const url = `/uploads/settings/${file.filename}`;
    await this.settingsService.updateLogo(url);
    return { url };
  }

  @Post('upload/favicon')
  @UseInterceptors(FileInterceptor('file', {
    storage: storageConfig,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|svg\+xml|x-icon)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    }
  }))
  async uploadFavicon(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');
    const url = `/uploads/settings/${file.filename}`;
    await this.settingsService.updateFavicon(url);
    return { url };
  }

  @Delete('logo')
  async removeLogo() {
    await this.settingsService.updateLogo(null);
    return { success: true };
  }

  @Delete('favicon')
  async removeFavicon() {
    await this.settingsService.updateFavicon(null);
    return { success: true };
  }
}
