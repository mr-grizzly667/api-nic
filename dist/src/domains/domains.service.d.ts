import { PrismaService } from '../prisma.service';
export interface DomainCheckResult {
    domain: string;
    available: boolean;
    status?: string[];
    creationDate?: string;
    expirationDate?: string;
    registrar?: string;
    nameservers?: string[];
    suggestions?: {
        domain: string;
        available: boolean;
    }[];
}
export declare class DomainsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    checkAvailability(query: string): Promise<DomainCheckResult>;
    private queryRDAP;
}
