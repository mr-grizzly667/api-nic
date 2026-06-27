import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        job_title: true,
        role: true,
        avatar: true,
        language: true,
        theme: true,
        default_admin_page: true,
        last_login: true,
        password_changed_at: true,
        created_at: true
      }
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async updateProfile(userId: number, data: { first_name: string; last_name: string; email: string; phone?: string; job_title?: string }) {
    // Check if email already exists for another user
    if (data.email) {
      const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
      if (existing && existing.id !== userId) {
        throw new BadRequestException('Cet email est déjà utilisé.');
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        job_title: data.job_title
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        job_title: true,
        role: true,
        avatar: true,
        language: true,
        theme: true,
        default_admin_page: true,
        last_login: true,
        created_at: true
      }
    });

    await this.logActivity(userId, 'Profil mis à jour', 'User', userId);
    return user;
  }

  async updateAvatar(userId: number, fileUrl: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.avatar) {
      // Clean up old avatar if exists
      const oldPath = path.join(process.cwd(), user.avatar.replace(/^\//, ''));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: fileUrl },
      select: { id: true, avatar: true }
    });

    await this.logActivity(userId, 'Photo de profil modifiée', 'User', userId);
    return updatedUser;
  }

  async updatePreferences(userId: number, data: { language?: string; theme?: string; default_admin_page?: string }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: { language: true, theme: true, default_admin_page: true }
    });

    await this.logActivity(userId, 'Préférences mises à jour', 'User', userId);
    return user;
  }

  async getActivity(userId: number) {
    return this.prisma.activityLog.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 10
    });
  }

  async getStats(userId: number) {
    const newsCount = await this.prisma.news.count({ where: { author_id: userId } });
    const docsCount = await this.prisma.document.count({ where: { created_by: userId } });
    const ticketsCount = await this.prisma.supportTicket.count({ where: { assigned_to: userId } });
    
    // Get last activity overall
    const lastActivity = await this.prisma.activityLog.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });

    return {
      newsPublished: newsCount,
      documentsAdded: docsCount,
      ticketsHandled: ticketsCount,
      lastActivityDate: lastActivity?.created_at || null
    };
  }

  async changePassword(userId: number, currentPass: string, newPass: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const isValid = await bcrypt.compare(currentPass, user.password);
    if (!isValid) throw new BadRequestException('Mot de passe actuel incorrect');

    const hashed = await bcrypt.hash(newPass, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashed,
        password_changed_at: new Date()
      }
    });

    await this.logActivity(userId, 'Mot de passe modifié', 'User', userId);
    return { success: true };
  }

  // Admin User Management
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        is_active: true,
        last_login: true,
        created_at: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async createUser(data: any) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new BadRequestException('Cet email est déjà utilisé.');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const names = data.name.split(' ');
    const first_name = names[0];
    const last_name = names.slice(1).join(' ') || '';

    return this.prisma.user.create({
      data: {
        first_name,
        last_name,
        email: data.email,
        password: hashedPassword,
        role: data.role === 'Admin' ? 'admin' : 'editor',
        is_active: data.status === 'Actif',
      },
      select: { id: true, email: true, first_name: true, last_name: true, role: true, is_active: true }
    });
  }

  async updateUser(id: number, data: any) {
    if (data.email) {
      const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
      if (existing && existing.id !== id) throw new BadRequestException('Cet email est déjà utilisé.');
    }

    const updateData: any = {
      email: data.email,
      role: data.role === 'Admin' ? 'admin' : 'editor',
      is_active: data.status === 'Actif',
    };

    if (data.name) {
      const names = data.name.split(' ');
      updateData.first_name = names[0];
      updateData.last_name = names.slice(1).join(' ') || '';
    }

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, first_name: true, last_name: true, role: true, is_active: true }
    });
  }

  async removeUser(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  private async logActivity(userId: number, action: string, entityType: string, entityId?: number) {
    await this.prisma.activityLog.create({
      data: {
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId
      }
    });
  }
}
