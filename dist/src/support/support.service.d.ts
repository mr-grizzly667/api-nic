import { PrismaService } from '../prisma.service';
import { CreateTicketDto, AddMessageDto } from './dto/support.dto';
import { EmailService } from '../email/email.service';
export declare class SupportService {
    private prisma;
    private emailService;
    constructor(prisma: PrismaService, emailService: EmailService);
    private generateTicketNumber;
    private addHistory;
    createTicket(dto: CreateTicketDto, fileUrl?: string): Promise<{
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
    findOne(id: number): Promise<{
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
    findByTrackingInfo(ticketNumber: string, email: string): Promise<{
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
    updateStatus(id: number, status: string, adminName: string): Promise<{
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
    assignTicket(id: number, adminId: number, adminName: string, assigneeName: string): Promise<{
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
    addMessage(id: number, dto: AddMessageDto, authorName: string, sender: 'user' | 'admin'): Promise<{
        id: number;
        created_at: Date;
        message: string;
        ticket_id: number;
        sender: string;
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
}
