import { PrismaService } from '../prisma.service';
export declare class SupportReportService {
    private prisma;
    constructor(prisma: PrismaService);
    getAnalytics(): Promise<{
        totalTickets: number;
        newTickets: number;
        resolvedTickets: number;
        closedTickets: number;
        criticalTickets: number;
        inProgressTickets: number;
        resolutionRate: number;
        averageResolutionTime: number;
        monthlyEvolution: any[];
        topIncidents: {
            name: string;
            count: number;
        }[];
        topRegistrars: {
            name: string;
            count: number;
        }[];
        aiSummary: string;
    }>;
    generatePdfReport(payload: {
        period: string;
        responsible: string;
        observations: string;
        chartImage?: string;
    }): Promise<{
        id: number;
        created_at: Date;
        title: string;
        file_url: string;
        period: string;
        generated_by: string;
    }>;
    findAllReports(): Promise<{
        id: number;
        created_at: Date;
        title: string;
        file_url: string;
        period: string;
        generated_by: string;
    }[]>;
    deleteReport(id: number): Promise<{
        id: number;
        created_at: Date;
        title: string;
        file_url: string;
        period: string;
        generated_by: string;
    }>;
}
