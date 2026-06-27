import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
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
    updateProfile(req: any, body: {
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
    updateAvatar(req: any, file: Express.Multer.File): Promise<{
        id: number;
        avatar: string | null;
    }>;
    changePassword(req: any, body: {
        currentPass: string;
        newPass: string;
    }): Promise<{
        success: boolean;
    }>;
    getActivity(req: any): Promise<{
        id: number;
        created_at: Date;
        action: string;
        entity_type: string;
        entity_id: number | null;
        details: string | null;
        user_id: number;
    }[]>;
    getStats(req: any): Promise<{
        newsPublished: number;
        documentsAdded: number;
        ticketsHandled: number;
        lastActivityDate: Date | null;
    }>;
    updatePreferences(req: any, body: {
        language?: string;
        theme?: string;
        default_admin_page?: string;
    }): Promise<{
        language: string | null;
        theme: string | null;
        default_admin_page: string | null;
    }>;
    findAllUsers(): Promise<{
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        role: string;
        is_active: boolean;
        last_login: Date | null;
        created_at: Date;
    }[]>;
    createUser(body: any): Promise<{
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        role: string;
        is_active: boolean;
    }>;
    updateUser(id: string, body: any): Promise<{
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        role: string;
        is_active: boolean;
    }>;
    removeUser(id: string): Promise<{
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
}
