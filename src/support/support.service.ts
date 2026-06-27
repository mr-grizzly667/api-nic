import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTicketDto, AddMessageDto } from './dto/support.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class SupportService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  private async generateTicketNumber(): Promise<string> {
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
    
    // Count tickets created today to generate sequential number
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

  private async addHistory(ticketId: number, action: string, author: string, details?: string) {
    await this.prisma.ticketHistory.create({
      data: {
        ticket_id: ticketId,
        action,
        author,
        details,
      }
    });
  }

  async createTicket(dto: CreateTicketDto, fileUrl?: string) {
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

    await this.emailService.sendTicketCreationEmail(
      dto.email,
      ticketNumber,
      ticket.status,
      dto.subject
    );

    return ticket;
  }

  async findAll(query: any) {
    const { category, priority, status, search } = query;
    const where: any = {};

    if (category && category !== 'Tous') where.category = category;
    if (priority && priority !== 'Toutes') where.priority = priority;
    if (status && status !== 'Tous') where.status = status;
    
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

  async findOne(id: number) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
      include: { 
        messages: { orderBy: { created_at: 'asc' } },
        histories: { orderBy: { created_at: 'desc' } },
        assignee: { select: { id: true, first_name: true, last_name: true } }
      },
    });

    if (!ticket) throw new NotFoundException('Ticket introuvable');
    return ticket;
  }

  async findByTrackingInfo(ticketNumber: string, email: string) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { ticket_number: ticketNumber },
      include: { 
        messages: { orderBy: { created_at: 'asc' } },
        histories: { orderBy: { created_at: 'desc' } },
      },
    });

    if (!ticket || ticket.email !== email) {
      throw new NotFoundException('Ticket introuvable ou informations incorrectes');
    }
    
    return ticket;
  }

  async updateStatus(id: number, status: string, adminName: string) {
    const ticket = await this.findOne(id);
    const oldStatus = ticket.status;

    let updateData: any = { status };

    // Calculate SLAs if applicable
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

    await this.emailService.sendTicketStatusChangeEmail(
      updated.email,
      updated.ticket_number,
      status
    );

    return updated;
  }

  async assignTicket(id: number, adminId: number, adminName: string, assigneeName: string) {
    const updated = await this.prisma.supportTicket.update({
      where: { id },
      data: { assigned_to: adminId },
    });

    await this.addHistory(id, `Assigné à ${assigneeName}`, adminName);

    return updated;
  }

  async addMessage(id: number, dto: AddMessageDto, authorName: string, sender: 'user' | 'admin') {
    const ticket = await this.findOne(id);

    // If admin replies for the first time, record first_response_at
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
      await this.emailService.sendTicketCommentEmail(
        ticket.email,
        ticket.ticket_number,
        dto.message
      );
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
}
