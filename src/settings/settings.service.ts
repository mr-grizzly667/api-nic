import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.siteSetting.findUnique({ where: { id: 1 } });
    if (!settings) {
      settings = await this.prisma.siteSetting.create({
        data: {
          id: 1,
          site_name: 'NIC.CI',
        },
      });
    }
    return settings;
  }

  async updateSettings(data: any) {
    return this.prisma.siteSetting.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });
  }

  async updateLogo(logoUrl: string | null) {
    return this.prisma.siteSetting.upsert({
      where: { id: 1 },
      update: { logo_url: logoUrl },
      create: { id: 1, logo_url: logoUrl },
    });
  }

  async updateFavicon(faviconUrl: string | null) {
    return this.prisma.siteSetting.upsert({
      where: { id: 1 },
      update: { favicon_url: faviconUrl },
      create: { id: 1, favicon_url: faviconUrl },
    });
  }
}
