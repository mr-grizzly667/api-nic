import { SupportService } from './support.service';
import { SupportReportService } from './support-report.service';
import { CreateTicketDto, AddMessageDto } from './dto/support.dto';
export declare class SupportController {
    private readonly supportService;
    private readonly supportReportService;
    constructor(supportService: SupportService, supportReportService: SupportReportService);
    create(createTicketDto: CreateTicketDto, file: Express.Multer.File): Promise<{
        id: number;
        email: string;
        phone: string | null;
        created_at: Date;
        updated_at: Date;
        name: string;
        description: string;
        category: string;
        status: string;
        domain: string | null;
        organization: string | null;
        priority: string;
        subject: string;
        ticket_number: string;
        attachment: string | null;
        first_response_at: Date | null;
        resolved_at: Date | null;
        processing_time_minutes: number | null;
        assigned_to: number | null;
    }>;
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
    generateReport(body: {
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
    getReports(): Promise<{
        id: number;
        created_at: Date;
        title: string;
        file_url: string;
        period: string;
        generated_by: string;
    }[]>;
    deleteReport(id: string): Promise<{
        id: number;
        created_at: Date;
        title: string;
        file_url: string;
        period: string;
        generated_by: string;
    }>;
    getNotifications(): Promise<{
        unreadCount: number;
        recent: {
            id: number;
            created_at: Date;
            name: string;
            subject: string;
            ticket_number: string;
        }[];
    }>;
    findAll(query: any): Promise<({
        assignee: {
            id: number;
            first_name: string;
            last_name: string;
        } | null;
    } & {
        id: number;
        email: string;
        phone: string | null;
        created_at: Date;
        updated_at: Date;
        name: string;
        description: string;
        category: string;
        status: string;
        domain: string | null;
        organization: string | null;
        priority: string;
        subject: string;
        ticket_number: string;
        attachment: string | null;
        first_response_at: Date | null;
        resolved_at: Date | null;
        processing_time_minutes: number | null;
        assigned_to: number | null;
    })[]>;
    findOne(id: string): Promise<{
        assignee: {
            id: number;
            first_name: string;
            last_name: string;
        } | null;
        messages: {
            id: number;
            created_at: Date;
            message: string;
            ticket_id: number;
            sender: string;
        }[];
        histories: {
            id: number;
            created_at: Date;
            author: string;
            action: string;
            details: string | null;
            ticket_id: number;
        }[];
    } & {
        id: number;
        email: string;
        phone: string | null;
        created_at: Date;
        updated_at: Date;
        name: string;
        description: string;
        category: string;
        status: string;
        domain: string | null;
        organization: string | null;
        priority: string;
        subject: string;
        ticket_number: string;
        attachment: string | null;
        first_response_at: Date | null;
        resolved_at: Date | null;
        processing_time_minutes: number | null;
        assigned_to: number | null;
    }>;
    updateStatus(id: string, status: string, adminName: string): Promise<{
        id: number;
        email: string;
        phone: string | null;
        created_at: Date;
        updated_at: Date;
        name: string;
        description: string;
        category: string;
        status: string;
        domain: string | null;
        organization: string | null;
        priority: string;
        subject: string;
        ticket_number: string;
        attachment: string | null;
        first_response_at: Date | null;
        resolved_at: Date | null;
        processing_time_minutes: number | null;
        assigned_to: number | null;
    }>;
    assignTicket(id: string, adminId: number, adminName: string, assigneeName: string): Promise<{
        id: number;
        email: string;
        phone: string | null;
        created_at: Date;
        updated_at: Date;
        name: string;
        description: string;
        category: string;
        status: string;
        domain: string | null;
        organization: string | null;
        priority: string;
        subject: string;
        ticket_number: string;
        attachment: string | null;
        first_response_at: Date | null;
        resolved_at: Date | null;
        processing_time_minutes: number | null;
        assigned_to: number | null;
    }>;
    addMessage(id: string, addMessageDto: AddMessageDto, authorName: string, sender: 'user' | 'admin'): Promise<{
        id: number;
        created_at: Date;
        message: string;
        ticket_id: number;
        sender: string;
    }>;
    publicTracking(ticketNumber: string, email: string): Promise<{
        messages: {
            id: number;
            created_at: Date;
            message: string;
            ticket_id: number;
            sender: string;
        }[];
        histories: {
            id: number;
            created_at: Date;
            author: string;
            action: string;
            details: string | null;
            ticket_id: number;
        }[];
    } & {
        id: number;
        email: string;
        phone: string | null;
        created_at: Date;
        updated_at: Date;
        name: string;
        description: string;
        category: string;
        status: string;
        domain: string | null;
        organization: string | null;
        priority: string;
        subject: string;
        ticket_number: string;
        attachment: string | null;
        first_response_at: Date | null;
        resolved_at: Date | null;
        processing_time_minutes: number | null;
        assigned_to: number | null;
    }>;
    handleEmailReply(inboundEmailPayload: any): Promise<{
        status: string;
    }>;
}
