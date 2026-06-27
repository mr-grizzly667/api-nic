import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as fs from 'fs';
import * as path from 'path';
const pdfmake = require('pdfmake');

@Injectable()
export class SupportReportService {
  constructor(private prisma: PrismaService) {}

  async getAnalytics() {
    const allTickets = await this.prisma.supportTicket.findMany();
    
    const total = allTickets.length;
    const newTickets = allTickets.filter(t => t.status === 'Nouveau').length;
    const resolved = allTickets.filter(t => t.status === 'Résolu').length;
    const closed = allTickets.filter(t => t.status === 'Fermé' || t.status === 'Clôturé').length;
    const critical = allTickets.filter(t => t.priority === 'Critique').length;
    const inProgress = allTickets.filter(t => t.status === 'En cours').length;

    const resolutionRate = total > 0 ? ((resolved + closed) / total) * 100 : 0;

    const ticketsWithProcessingTime = allTickets.filter(t => t.processing_time_minutes != null);
    const avgTimeMinutes = ticketsWithProcessingTime.length > 0 
      ? ticketsWithProcessingTime.reduce((sum, t) => sum + (t.processing_time_minutes || 0), 0) / ticketsWithProcessingTime.length
      : 0;

    // Monthly evolution (last 6 months)
    const monthlyEvolution: any[] = [];
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = months[d.getMonth()];
      const count = allTickets.filter(t => {
        const tDate = new Date(t.created_at);
        return tDate.getMonth() === d.getMonth() && tDate.getFullYear() === d.getFullYear();
      }).length;
      monthlyEvolution.push({ month: monthName, tickets: count });
    }

    // Top 5 Incidents (Category)
    const categoryCounts: Record<string, number> = {};
    allTickets.forEach(t => {
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    });
    const topIncidents = Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top 5 Registrars/Domains (Organization/Domain)
    const orgCounts: Record<string, number> = {};
    allTickets.forEach(t => {
      const name = t.organization || t.domain || 'Particulier';
      orgCounts[name] = (orgCounts[name] || 0) + 1;
    });
    const topRegistrars = Object.entries(orgCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const smartSummary = `Au cours de la période, le service support a traité ${total} tickets. ${resolved + closed} tickets ont été résolus ou clôturés. Le taux de résolution atteint ${resolutionRate.toFixed(1)} %. Les incidents les plus fréquents concernent : ${topIncidents.map(i => i.name).join(', ')}.`;

    return {
      totalTickets: total,
      newTickets,
      resolvedTickets: resolved,
      closedTickets: closed,
      criticalTickets: critical,
      inProgressTickets: inProgress,
      resolutionRate: Number(resolutionRate.toFixed(1)),
      averageResolutionTime: Math.round(avgTimeMinutes),
      monthlyEvolution,
      topIncidents,
      topRegistrars,
      aiSummary: smartSummary
    };
  }

  async generatePdfReport(payload: { period: string; responsible: string; observations: string; chartImage?: string }) {
    const analytics = await this.getAnalytics();
    const fileName = `rapport_support_${Date.now()}.pdf`;
    const reportsDir = path.join(process.cwd(), 'uploads', 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    const filePath = path.join(reportsDir, fileName);

    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
      }
    };
    pdfmake.setFonts(fonts);

    const docDefinition: any = {
      defaultStyle: { font: 'Helvetica' },
      content: [
        { text: 'NIC.CI - Rapport du Support Technique', style: 'header', alignment: 'center', margin: [0, 0, 0, 20] },
        {
          columns: [
            { text: `Période : ${payload.period}`, bold: true },
            { text: `Responsable : ${payload.responsible}`, alignment: 'right' }
          ],
          margin: [0, 0, 0, 20]
        },
        { text: '1. Statistiques Globales', style: 'subheader' },
        {
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              ['Total Tickets', 'Nouveaux', 'Résolus', 'Clôturés'],
              [analytics.totalTickets, analytics.newTickets, analytics.resolvedTickets, analytics.closedTickets],
              ['Taux Résolution', 'Temps Moyen', 'En Cours', 'Critiques'],
              [`${analytics.resolutionRate}%`, `${analytics.averageResolutionTime} min`, analytics.inProgressTickets, analytics.criticalTickets]
            ]
          },
          margin: [0, 0, 0, 20]
        },
        { text: '2. Analyse Automatique', style: 'subheader' },
        { text: analytics.aiSummary, margin: [0, 0, 0, 20] },
      ],
      styles: {
        header: { fontSize: 22, bold: true },
        subheader: { fontSize: 16, bold: true, margin: [0, 10, 0, 5] }
      }
    };

    if (payload.chartImage && payload.chartImage.startsWith('data:image')) {
      docDefinition.content.push({ text: '3. Évolution Mensuelle', style: 'subheader' });
      docDefinition.content.push({
        image: payload.chartImage,
        width: 500,
        alignment: 'center',
        margin: [0, 0, 0, 20]
      });
    }

    if (payload.observations) {
      docDefinition.content.push({ text: '4. Observations', style: 'subheader' });
      docDefinition.content.push({ text: payload.observations, margin: [0, 0, 0, 20] });
    }

    docDefinition.content.push({ text: `Rapport généré le ${new Date().toLocaleDateString('fr-FR')} par le système NIC.CI`, alignment: 'center', fontSize: 10, color: 'gray', margin: [0, 20, 0, 0] });

    const doc = pdfmake.createPdf(docDefinition);
    await doc.write(filePath);
    
    const fileUrl = `/uploads/reports/${fileName}`;
    const report = await this.prisma.supportReport.create({
      data: {
        title: `Rapport Support - ${payload.period}`,
        period: payload.period,
        generated_by: payload.responsible,
        file_url: fileUrl,
      }
    });
    return report;
  }

  async findAllReports() {
    return this.prisma.supportReport.findMany({ orderBy: { created_at: 'desc' } });
  }

  async deleteReport(id: number) {
    const report = await this.prisma.supportReport.findUnique({ where: { id } });
    if (!report) throw new NotFoundException('Rapport introuvable');
    const filePath = path.join(process.cwd(), report.file_url.replace(/^\//, ''));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return this.prisma.supportReport.delete({ where: { id } });
  }
}
