"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
let EmailService = EmailService_1 = class EmailService {
    logger = new common_1.Logger(EmailService_1.name);
    async sendEmail(to, subject, body) {
        this.logger.log(`\n================= EMAIL ENVOYÉ =================\nÀ: ${to}\nSujet: ${subject}\n\n${body}\n================================================\n`);
    }
    async sendTicketCreationEmail(to, ticketNumber, status, summary) {
        const subject = `[NIC.CI] Ticket ${ticketNumber} créé`;
        const body = `Bonjour,\n\nVotre ticket a bien été créé.\n\nNuméro: ${ticketNumber}\nStatut actuel: ${status}\nRésumé de la demande: ${summary}\nDate de création: ${new Date().toLocaleString('fr-FR')}\n\nVous pouvez suivre l'avancement de votre ticket en vous rendant sur notre page de suivi (N° de ticket + Email) ou répondre directement à cet email.\n\nCordialement,\nL'équipe Support NIC.CI`;
        await this.sendEmail(to, subject, body);
    }
    async sendTicketStatusChangeEmail(to, ticketNumber, newStatus) {
        const subject = `[NIC.CI] Mise à jour de votre ticket ${ticketNumber}`;
        const body = `Bonjour,\n\nLe statut de votre ticket ${ticketNumber} a été mis à jour.\nNouveau statut: ${newStatus}\n\nVous pouvez suivre l'avancement de votre ticket en vous rendant sur notre page de suivi.\n\nCordialement,\nL'équipe Support NIC.CI`;
        await this.sendEmail(to, subject, body);
    }
    async sendTicketCommentEmail(to, ticketNumber, comment) {
        const subject = `[NIC.CI] Nouveau message sur votre ticket ${ticketNumber}`;
        const body = `Bonjour,\n\nUn nouveau message a été ajouté à votre ticket ${ticketNumber} :\n\n"${comment}"\n\nRépondre à ce message pour compléter votre ticket.\n\nCordialement,\nL'équipe Support NIC.CI`;
        await this.sendEmail(to, subject, body);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)()
], EmailService);
//# sourceMappingURL=email.service.js.map