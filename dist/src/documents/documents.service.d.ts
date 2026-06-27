import { PrismaService } from '../prisma.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/documents.dto';
export declare class DocumentsService {
    private prisma;
    constructor(prisma: PrismaService);
    private logActivity;
    create(createDto: CreateDocumentDto, fileData: any, userId: number): Promise<{
        id: number;
        created_at: Date;
        updated_at: Date;
        title: string;
        description: string;
        category: string;
        file_name: string;
        file_url: string;
        file_type: string;
        file_size: string;
        status: string;
        version: string;
        featured: boolean;
        downloads: number;
        last_download_at: Date | null;
        created_by: number;
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
            description: string;
            category: string;
            file_name: string;
            file_url: string;
            file_type: string;
            file_size: string;
            status: string;
            version: string;
            featured: boolean;
            downloads: number;
            last_download_at: Date | null;
            created_by: number;
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
        description: string;
        category: string;
        file_name: string;
        file_url: string;
        file_type: string;
        file_size: string;
        status: string;
        version: string;
        featured: boolean;
        downloads: number;
        last_download_at: Date | null;
        created_by: number;
    }>;
    update(id: number, updateDto: UpdateDocumentDto, fileData: any, userId: number): Promise<{
        id: number;
        created_at: Date;
        updated_at: Date;
        title: string;
        description: string;
        category: string;
        file_name: string;
        file_url: string;
        file_type: string;
        file_size: string;
        status: string;
        version: string;
        featured: boolean;
        downloads: number;
        last_download_at: Date | null;
        created_by: number;
    }>;
    remove(id: number, userId: number): Promise<{
        id: number;
        created_at: Date;
        updated_at: Date;
        title: string;
        description: string;
        category: string;
        file_name: string;
        file_url: string;
        file_type: string;
        file_size: string;
        status: string;
        version: string;
        featured: boolean;
        downloads: number;
        last_download_at: Date | null;
        created_by: number;
    }>;
    incrementDownload(id: number): Promise<{
        id: number;
        created_at: Date;
        updated_at: Date;
        title: string;
        description: string;
        category: string;
        file_name: string;
        file_url: string;
        file_type: string;
        file_size: string;
        status: string;
        version: string;
        featured: boolean;
        downloads: number;
        last_download_at: Date | null;
        created_by: number;
    }>;
}
