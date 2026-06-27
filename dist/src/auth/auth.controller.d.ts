import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            name: string;
            role: string;
            avatar: string | null;
        };
    }>;
    logout(): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<{
        id: number;
        email: string;
        name: string;
        role: string;
        avatar: string | null;
    }>;
}
