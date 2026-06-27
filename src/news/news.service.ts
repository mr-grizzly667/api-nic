import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  generateSlug(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 6);
  }

  async create(createNewsDto: CreateNewsDto, authorId: number) {
    const slug = this.generateSlug(createNewsDto.title);
    return this.prisma.news.create({
      data: {
        ...createNewsDto,
        slug,
        author_id: authorId,
        published_at: createNewsDto.status === 'Publié' ? new Date() : null,
      },
    });
  }

  async findAll(params: { skip?: number; take?: number; search?: string; category?: string; status?: string }) {
    const { skip, take, search, category, status } = params;
    const where: any = {};
    if (search) where.OR = [{ title: { contains: search } }, { summary: { contains: search } }];
    if (category && category !== 'Tous') where.category = category;
    if (status && status !== 'all') where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.news.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: { author: { select: { first_name: true, last_name: true } } },
      }),
      this.prisma.news.count({ where }),
    ]);

    return { items, total };
  }

  async findOne(id: number) {
    const news = await this.prisma.news.findUnique({
      where: { id },
      include: { author: { select: { first_name: true, last_name: true } } },
    });
    if (!news) throw new NotFoundException('Actualité non trouvée');
    return news;
  }

  async update(id: number, updateNewsDto: UpdateNewsDto) {
    const data: any = { ...updateNewsDto };
    if (updateNewsDto.status === 'Publié') {
      const existing = await this.findOne(id);
      if (!existing.published_at) data.published_at = new Date();
    }
    return this.prisma.news.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.news.delete({ where: { id } });
  }
}
