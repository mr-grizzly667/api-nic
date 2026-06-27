import { Controller, Get, Post, Body, Patch, Param, Query, UseInterceptors, UploadedFile, BadRequestException, Delete } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportReportService } from './support-report.service';
import { CreateTicketDto, AddMessageDto } from './dto/support.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

const storage = diskStorage({
  destination: './uploads/tickets',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
  },
});

@Controller('support')
export class SupportController {
  constructor(
    private readonly supportService: SupportService,
    private readonly supportReportService: SupportReportService
  ) {}

  @Post('tickets')
  @UseInterceptors(FileInterceptor('file', {
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(pdf|doc|docx|jpg|jpeg|png|zip)$/i)) {
        return cb(new BadRequestException('Format de fichier non supporté'), false);
      }
      cb(null, true);
    }
  }))
  create(@Body() createTicketDto: CreateTicketDto, @UploadedFile() file: Express.Multer.File) {
    const fileUrl = file ? `/uploads/tickets/${file.filename}` : undefined;
    return this.supportService.createTicket(createTicketDto, fileUrl);
  }

  // --- ADMIN ROUTES ---
  @Get('analytics')
  getAnalytics() {
    return this.supportReportService.getAnalytics();
  }

  @Post('reports/generate')
  generateReport(@Body() body: { period: string; responsible: string; observations: string; chartImage?: string }) {
    return this.supportReportService.generatePdfReport(body);
  }

  @Get('reports')
  getReports() {
    return this.supportReportService.findAllReports();
  }

  @Delete('reports/:id')
  deleteReport(@Param('id') id: string) {
    return this.supportReportService.deleteReport(+id);
  }

  @Get('notifications')
  getNotifications() {
    return this.supportService.getNotifications();
  }

  @Get('tickets')
  findAll(@Query() query: any) {
    return this.supportService.findAll(query);
  }

  @Get('tickets/:id')
  findOne(@Param('id') id: string) {
    return this.supportService.findOne(+id);
  }

  @Patch('tickets/:id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string, @Body('adminName') adminName: string) {
    return this.supportService.updateStatus(+id, status, adminName || 'Système');
  }

  @Patch('tickets/:id/assign')
  assignTicket(@Param('id') id: string, @Body('adminId') adminId: number, @Body('adminName') adminName: string, @Body('assigneeName') assigneeName: string) {
    return this.supportService.assignTicket(+id, adminId, adminName, assigneeName);
  }

  @Post('tickets/:id/messages')
  addMessage(@Param('id') id: string, @Body() addMessageDto: AddMessageDto, @Body('authorName') authorName: string, @Body('sender') sender: 'user' | 'admin') {
    return this.supportService.addMessage(+id, addMessageDto, authorName || 'Anonyme', sender || 'admin');
  }

  // --- PUBLIC ROUTES (No-Account Access) ---
  @Post('suivi')
  publicTracking(@Body('ticket_number') ticketNumber: string, @Body('email') email: string) {
    return this.supportService.findByTrackingInfo(ticketNumber, email);
  }

  @Post('webhook/email-reply')
  async handleEmailReply(@Body() inboundEmailPayload: any) {
    // This is a placeholder for a real email parsing webhook (like SendGrid Inbound Parse)
    // The implementation would parse inboundEmailPayload, extract the ticket_number from the subject,
    // verify the sender email matches the ticket, and call `addMessage` as 'user'.
    console.log('[WEBHOOK EMAIL] Reçu un email entrant à parser plus tard :', inboundEmailPayload.subject);
    return { status: 'received' };
  }
}
