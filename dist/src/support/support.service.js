"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const email_service_1 = require("../email/email.service");
let SupportService = class SupportService {
    prisma;
    emailService;
    constructor(prisma, emailService) {
        this.prisma = prisma;
        this.emailService = emailService;
    }
    async generateTicketNumber() {
        const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const count = await this.prisma.supportTicket.count({
            where: {
                created_at: {
                    gte: startOfDay
                }
            }
        });
        const sequential = String(count + 1).padStart(4, '0');
        return `TCK-${dateStr}-${sequential}`;
    }
    async addHistory(ticketId, action, author, details) {
        await this.prisma.ticketHistory.create({
            data: {
                ticket_id: ticketId,
                action,
                author,
                details,
            }
        });
    }
    async createTicket(dto, fileUrl) {
        const ticketNumber = await this.generateTicketNumber();
        const ticket = await this.prisma.supportTicket.create({
            data: {
                ...dto,
                ticket_number: ticketNumber,
                attachment: fileUrl,
                status: 'Nouveau',
            },
        });
        await this.addHistory(ticket.id, 'Création du ticket', dto.name);
        await this.emailService.sendTicketCreationEmail(dto.email, ticketNumber, ticket.status, dto.subject);
        return ticket;
    }
    async findAll(query) {
        const { category, priority, status, search } = query;
        const where = {};
        if (category && category !== 'Tous')
            where.category = category;
        if (priority && priority !== 'Toutes')
            where.priority = priority;
        if (status && status !== 'Tous')
            where.status = status;
        if (search) {
            where.OR = [
                { ticket_number: { contains: search } },
                { subject: { contains: search } },
                { name: { contains: search } },
            ];
        }
        const tickets = await this.prisma.supportTicket.findMany({
            where,
            include: {
                assignee: { select: { id: true, first_name: true, last_name: true } }
            },
            orderBy: { created_at: 'desc' },
        });
        return tickets;
    }
    async findOne(id) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: { id },
            include: {
                messages: { orderBy: { created_at: 'asc' } },
                histories: { orderBy: { created_at: 'desc' } },
                assignee: { select: { id: true, first_name: true, last_name: true } }
            },
        });
        if (!ticket)
            throw new common_1.NotFoundException('Ticket introuvable');
        return ticket;
    }
    async findByTrackingInfo(ticketNumber, email) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: { ticket_number: ticketNumber },
            include: {
                messages: { orderBy: { created_at: 'asc' } },
                histories: { orderBy: { created_at: 'desc' } },
            },
        });
        if (!ticket || ticket.email !== email) {
            throw new common_1.NotFoundException('Ticket introuvable ou informations incorrectes');
        }
        return ticket;
    }
    async updateStatus(id, status, adminName) {
        const ticket = await this.findOne(id);
        const oldStatus = ticket.status;
        let updateData = { status };
        if (status === 'Résolu' || status === 'Fermé') {
            if (!ticket.resolved_at) {
                updateData.resolved_at = new Date();
                const diffMs = new Date().getTime() - ticket.created_at.getTime();
                updateData.processing_time_minutes = Math.round(diffMs / 60000);
            }
        }
        const updated = await this.prisma.supportTicket.update({
            where: { id },
            data: updateData,
        });
        await this.addHistory(id, `Statut changé de ${oldStatus} à ${status}`, adminName);
        await this.emailService.sendTicketStatusChangeEmail(updated.email, updated.ticket_number, status);
        return updated;
    }
    async assignTicket(id, adminId, adminName, assigneeName) {
        const updated = await this.prisma.supportTicket.update({
            where: { id },
            data: { assigned_to: adminId },
        });
        await this.addHistory(id, `Assigné à ${assigneeName}`, adminName);
        return updated;
    }
    async addMessage(id, dto, authorName, sender) {
        const ticket = await this.findOne(id);
        if (sender === 'admin' && !ticket.first_response_at) {
            await this.prisma.supportTicket.update({
                where: { id },
                data: { first_response_at: new Date() }
            });
        }
        const message = await this.prisma.ticketMessage.create({
            data: {
                ticket_id: id,
                sender,
                message: dto.message,
            },
        });
        await this.addHistory(id, `Nouveau commentaire ajouté`, authorName);
        if (sender === 'admin') {
            await this.emailService.sendTicketCommentEmail(ticket.email, ticket.ticket_number, dto.message);
        }
        return message;
    }
    async getNotifications() {
        const unreadCount = await this.prisma.supportTicket.count({
            where: { status: 'Nouveau' }
        });
        const recentUnread = await this.prisma.supportTicket.findMany({
            where: { status: 'Nouveau' },
            orderBy: { created_at: 'desc' },
            take: 5,
            select: {
                id: true,
                ticket_number: true,
                subject: true,
                name: true,
                created_at: true
            }
        });
        return {
            unreadCount,
            recent: recentUnread
        };
    }
};
exports.SupportService = SupportService;
exports.SupportService = SupportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], SupportService);
//# sourceMappingURL=support.service.js.map