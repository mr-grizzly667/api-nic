import { DocumentsService } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/documents.dto';
import type { Response } from 'express';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    create(createDto: CreateDocumentDto, file: Express.Multer.File, req: any): Promise<{
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
    download(id: string, res: Response): Promise<void>;
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
    update(id: string, updateDto: UpdateDocumentDto, file: Express.Multer.File, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
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
