"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let DocumentsService = class DocumentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async logActivity(action, entityId, details, userId) {
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
    async create(createDto, fileData, userId) {
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
    async findAll(params) {
        const { skip, take, search, category, status } = params;
        const where = {};
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
    async findOne(id) {
        const doc = await this.prisma.document.findUnique({
            where: { id },
            include: { author: { select: { first_name: true, last_name: true } } },
        });
        if (!doc)
            throw new common_1.NotFoundException('Document non trouvé');
        return doc;
    }
    async update(id, updateDto, fileData, userId) {
        const dataToUpdate = { ...updateDto };
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
    async remove(id, userId) {
        const doc = await this.prisma.document.delete({
            where: { id },
        });
        await this.logActivity('DELETE', doc.id, `Document supprimé: ${doc.title}`, userId);
        return doc;
    }
    async incrementDownload(id) {
        return this.prisma.document.update({
            where: { id },
            data: {
                downloads: { increment: 1 },
                last_download_at: new Date(),
            },
        });
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map