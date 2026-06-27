import { PrismaService } from '../prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: number): Promise<{
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        phone: string | null;
        role: string;
        job_title: string | null;
        avatar: string | null;
        last_login: Date | null;
        password_changed_at: Date | null;
        language: string | null;
        theme: string | null;
        default_admin_page: string | null;
        created_at: Date;
    }>;
    updateProfile(userId: number, data: {
        first_name: string;
        last_name: string;
        email: string;
        phone?: string;
        job_title?: string;
    }): Promise<{
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        phone: string | null;
        role: string;
        job_title: string | null;
        avatar: string | null;
        last_login: Date | null;
        language: string | null;
        theme: string | null;
        default_admin_page: string | null;
        created_at: Date;
    }>;
    updateAvatar(userId: number, fileUrl: string): Promise<{
        id: number;
        avatar: string | null;
    }>;
    updatePreferences(userId: number, data: {
        language?: string;
        theme?: string;
        default_admin_page?: string;
    }): Promise<{
        language: string | null;
        theme: string | null;
        default_admin_page: string | null;
    }>;
    getActivity(userId: number): Promise<{
        id: number;
        created_at: Date;
        action: string;
        entity_type: string;
        entity_id: number | null;
        details: string | null;
        user_id: number;
    }[]>;
    getStats(userId: number): Promise<{
        newsPublished: number;
        documentsAdded: number;
        ticketsHandled: number;
        lastActivityDate: Date | null;
    }>;
    changePassword(userId: number, currentPass: string, newPass: string): Promise<{
        success: boolean;
    }>;
    findAll(): Promise<{
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        role: string;
        is_active: boolean;
        last_login: Date | null;
        created_at: Date;
    }[]>;
    createUser(data: any): Promise<{
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        role: string;
        is_active: boolean;
    }>;
    updateUser(id: number, data: any): Promise<{
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        role: string;
        is_active: boolean;
    }>;
    removeUser(id: number): Promise<{
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        password: string;
        phone: string | null;
        role: string;
        job_title: string | null;
        avatar: string | null;
        is_active: boolean;
        last_login: Date | null;
        password_changed_at: Date | null;
        language: string | null;
        theme: string | null;
        default_admin_page: string | null;
        created_at: Date;
        updated_at: Date;
    }>;
    private logActivity;
}
