import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
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
    getProfile(userId: number): Promise<{
        id: number;
        email: string;
        name: string;
        role: string;
        avatar: string | null;
    }>;
}
