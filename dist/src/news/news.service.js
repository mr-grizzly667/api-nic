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
exports.NewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let NewsService = class NewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateSlug(title) {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 6);
    }
    async create(createNewsDto, authorId) {
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
    async findAll(params) {
        const { skip, take, search, category, status } = params;
        const where = {};
        if (search)
            where.OR = [{ title: { contains: search } }, { summary: { contains: search } }];
        if (category && category !== 'Tous')
            where.category = category;
        if (status && status !== 'all')
            where.status = status;
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
    async findOne(id) {
        const news = await this.prisma.news.findUnique({
            where: { id },
            include: { author: { select: { first_name: true, last_name: true } } },
        });
        if (!news)
            throw new common_1.NotFoundException('Actualité non trouvée');
        return news;
    }
    async update(id, updateNewsDto) {
        const data = { ...updateNewsDto };
        if (updateNewsDto.status === 'Publié') {
            const existing = await this.findOne(id);
            if (!existing.published_at)
                data.published_at = new Date();
        }
        return this.prisma.news.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return this.prisma.news.delete({ where: { id } });
    }
};
exports.NewsService = NewsService;
exports.NewsService = NewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NewsService);
//# sourceMappingURL=news.service.js.map