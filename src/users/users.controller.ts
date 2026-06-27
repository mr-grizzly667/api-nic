import { Controller, Get, Put, Post, Delete, Param, Body, UseGuards, Request, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

const storage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads/avatars';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `avatar-${uniqueSuffix}${extname(file.originalname)}`);
  },
});

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Put('profile')
  updateProfile(@Request() req, @Body() body: { first_name: string; last_name: string; email: string; phone?: string; job_title?: string }) {
    return this.usersService.updateProfile(req.user.userId, body);
  }

  @Put('avatar')
  @UseInterceptors(FileInterceptor('file', {
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        return cb(new BadRequestException('Format de fichier non supporté. (JPG, JPEG, PNG, WEBP uniquement)'), false);
      }
      cb(null, true);
    }
  }))
  async updateAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Aucun fichier fourni');
    const fileUrl = `/uploads/avatars/${file.filename}`;
    return this.usersService.updateAvatar(req.user.userId, fileUrl);
  }

  @Put('change-password')
  changePassword(@Request() req, @Body() body: { currentPass: string; newPass: string }) {
    return this.usersService.changePassword(req.user.userId, body.currentPass, body.newPass);
  }

  @Get('activity')
  getActivity(@Request() req) {
    return this.usersService.getActivity(req.user.userId);
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.usersService.getStats(req.user.userId);
  }

  @Put('preferences')
  updatePreferences(@Request() req, @Body() body: { language?: string; theme?: string; default_admin_page?: string }) {
    return this.usersService.updatePreferences(req.user.userId, body);
  }

  // Admin User Management
  @Get()
  findAllUsers() {
    return this.usersService.findAll();
  }

  @Post()
  createUser(@Body() body: any) {
    return this.usersService.createUser(body);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() body: any) {
    return this.usersService.updateUser(Number(id), body);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(Number(id));
  }
}
