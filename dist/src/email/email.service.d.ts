export declare class EmailService {
    private readonly logger;
    sendEmail(to: string, subject: string, body: string): Promise<void>;
    sendTicketCreationEmail(to: string, ticketNumber: string, status: string, summary: string): Promise<void>;
    sendTicketStatusChangeEmail(to: string, ticketNumber: string, newStatus: string): Promise<void>;
    sendTicketCommentEmail(to: string, ticketNumber: string, comment: string): Promise<void>;
}
