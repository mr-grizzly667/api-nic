import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendEmail(to: string, subject: string, body: string) {
    // Dans un environnement de production, vous utiliseriez nodemailer ou un service comme SendGrid ici.
    // Pour l'instant, on simule l'envoi en loggant dans la console du serveur.
    
    this.logger.log(`\n================= EMAIL ENVOYÉ =================\nÀ: ${to}\nSujet: ${subject}\n\n${body}\n================================================\n`);
  }

  async sendTicketCreationEmail(to: string, ticketNumber: string, status: string, summary: string) {
    const subject = `[NIC.CI] Ticket ${ticketNumber} créé`;
    const body = `Bonjour,\n\nVotre ticket a bien été créé.\n\nNuméro: ${ticketNumber}\nStatut actuel: ${status}\nRésumé de la demande: ${summary}\nDate de création: ${new Date().toLocaleString('fr-FR')}\n\nVous pouvez suivre l'avancement de votre ticket en vous rendant sur notre page de suivi (N° de ticket + Email) ou répondre directement à cet email.\n\nCordialement,\nL'équipe Support NIC.CI`;
    await this.sendEmail(to, subject, body);
  }

  async sendTicketStatusChangeEmail(to: string, ticketNumber: string, newStatus: string) {
    const subject = `[NIC.CI] Mise à jour de votre ticket ${ticketNumber}`;
    const body = `Bonjour,\n\nLe statut de votre ticket ${ticketNumber} a été mis à jour.\nNouveau statut: ${newStatus}\n\nVous pouvez suivre l'avancement de votre ticket en vous rendant sur notre page de suivi.\n\nCordialement,\nL'équipe Support NIC.CI`;
    await this.sendEmail(to, subject, body);
  }

  async sendTicketCommentEmail(to: string, ticketNumber: string, comment: string) {
    const subject = `[NIC.CI] Nouveau message sur votre ticket ${ticketNumber}`;
    const body = `Bonjour,\n\nUn nouveau message a été ajouté à votre ticket ${ticketNumber} :\n\n"${comment}"\n\nRépondre à ce message pour compléter votre ticket.\n\nCordialement,\nL'équipe Support NIC.CI`;
    await this.sendEmail(to, subject, body);
  }
}
