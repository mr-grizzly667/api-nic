import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/documents.dto';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  private async logActivity(action: string, entityId: number, details: string, userId: number) {
    await this.prisma.activityLog.create({
      data: {
        action,
        entity_type: 'Document',
        entity_id: entityId,
        details,
        user_id: userId,
      },
    });
  }

  async create(createDto: CreateDocumentDto, fileData: any, userId: number) {
    const isFeatured = createDto.featured === 'true' || createDto.featured === true;

    const doc = await this.prisma.document.create({
      data: {
        title: createDto.title,
        description: createDto.description,
        category: createDto.category,
        status: createDto.status || 'Publié',
        version: createDto.version || '1.0',
        featured: isFeatured,
        file_name: fileData.originalname,
        file_url: `/uploads/documents/${fileData.filename}`,
        file_type: fileData.mimetype,
        file_size: `${(fileData.size / 1024 / 1024).toFixed(2)} MB`,
        created_by: userId,
      },
    });

    await this.logActivity('CREATE', doc.id, `Document créé: ${doc.title}`, userId);
    return doc;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    category?: string;
    status?: string;
  }) {
    const { skip, take, search, category, status } = params;

    const where: any = {};
    
    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.document.findMany({
        skip,
        take,
        where,
        orderBy: { created_at: 'desc' },
        include: { author: { select: { first_name: true, last_name: true } } },
      }),
      this.prisma.document.count({ where }),
    ]);

    return { items, total };
  }

  async findOne(id: number) {
    const doc = await this.prisma.document.findUnique({
      where: { id },
      include: { author: { select: { first_name: true, last_name: true } } },
    });
    if (!doc) throw new NotFoundException('Document non trouvé');
    return doc;
  }

  async update(id: number, updateDto: UpdateDocumentDto, fileData: any, userId: number) {
    const dataToUpdate: any = { ...updateDto };

    if (dataToUpdate.featured !== undefined) {
      dataToUpdate.featured = dataToUpdate.featured === 'true' || dataToUpdate.featured === true;
    }

    if (fileData) {
      dataToUpdate.file_name = fileData.originalname;
      dataToUpdate.file_url = `/uploads/documents/${fileData.filename}`;
      dataToUpdate.file_type = fileData.mimetype;
      dataToUpdate.file_size = `${(fileData.size / 1024 / 1024).toFixed(2)} MB`;
    }

    const doc = await this.prisma.document.update({
      where: { id },
      data: dataToUpdate,
    });

    await this.logActivity('UPDATE', doc.id, `Document modifié: ${doc.title}`, userId);
    return doc;
  }

  async remove(id: number, userId: number) {
    const doc = await this.prisma.document.delete({
      where: { id },
    });
    await this.logActivity('DELETE', doc.id, `Document supprimé: ${doc.title}`, userId);
    return doc;
  }

  async incrementDownload(id: number) {
    return this.prisma.document.update({
      where: { id },
      data: {
        downloads: { increment: 1 },
        last_download_at: new Date(),
      },
    });
  }
}
