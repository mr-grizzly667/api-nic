import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
export declare class NewsController {
    private readonly newsService;
    constructor(newsService: NewsService);
    create(createNewsDto: CreateNewsDto, req: any): Promise<{
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
    uploadImage(file: Express.Multer.File): {
        url: string;
    };
    findAll(page?: string, limit?: string, search?: string, category?: string, status?: string): Promise<{
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
    findOne(id: string): Promise<{
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
    update(id: string, updateNewsDto: UpdateNewsDto): Promise<{
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
    remove(id: string): Promise<{
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
