import { PrismaService } from '../prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
export declare class NewsService {
    private prisma;
    constructor(prisma: PrismaService);
    generateSlug(title: string): string;
    create(createNewsDto: CreateNewsDto, authorId: number): Promise<{
        id: number;
        created_at: Date;
        updated_at: Date;
        title: string;
        category: string;
        status: string;
        slug: string;
        summary: string;
        content: string;
        image_url: string | null;
        published_at: Date | null;
        author_id: number;
    }>;
    findAll(params: {
        skip?: number;
        take?: number;
        search?: string;
        category?: string;
        status?: string;
    }): Promise<{
        items: ({
            author: {
                first_name: string;
                last_name: string;
            };
        } & {
            id: number;
            created_at: Date;
            updated_at: Date;
            title: string;
            category: string;
            status: string;
            slug: string;
            summary: string;
            content: string;
            image_url: string | null;
            published_at: Date | null;
            author_id: number;
        })[];
        total: number;
    }>;
    findOne(id: number): Promise<{
        author: {
            first_name: string;
            last_name: string;
        };
    } & {
        id: number;
        created_at: Date;
        updated_at: Date;
        title: string;
        category: string;
        status: string;
        slug: string;
        summary: string;
        content: string;
        image_url: string | null;
        published_at: Date | null;
        author_id: number;
    }>;
    update(id: number, updateNewsDto: UpdateNewsDto): Promise<{
        id: number;
        created_at: Date;
        updated_at: Date;
        title: string;
        category: string;
        status: string;
        slug: string;
        summary: string;
        content: string;
        image_url: string | null;
        published_at: Date | null;
        author_id: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        created_at: Date;
        updated_at: Date;
        title: string;
        category: string;
        status: string;
        slug: string;
        summary: string;
        content: string;
        image_url: string | null;
        published_at: Date | null;
        author_id: number;
    }>;
}
