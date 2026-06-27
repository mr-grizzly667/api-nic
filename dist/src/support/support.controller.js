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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportController = void 0;
const common_1 = require("@nestjs/common");
const support_service_1 = require("./support.service");
const support_report_service_1 = require("./support-report.service");
const support_dto_1 = require("./dto/support.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const storage = (0, multer_1.diskStorage)({
    destination: './uploads/tickets',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
    },
});
let SupportController = class SupportController {
    supportService;
    supportReportService;
    constructor(supportService, supportReportService) {
        this.supportService = supportService;
        this.supportReportService = supportReportService;
    }
    create(createTicketDto, file) {
        const fileUrl = file ? `/uploads/tickets/${file.filename}` : undefined;
        return this.supportService.createTicket(createTicketDto, fileUrl);
    }
    getAnalytics() {
        return this.supportReportService.getAnalytics();
    }
    generateReport(body) {
        return this.supportReportService.generatePdfReport(body);
    }
    getReports() {
        return this.supportReportService.findAllReports();
    }
    deleteReport(id) {
        return this.supportReportService.deleteReport(+id);
    }
    getNotifications() {
        return this.supportService.getNotifications();
    }
    findAll(query) {
        return this.supportService.findAll(query);
    }
    findOne(id) {
        return this.supportService.findOne(+id);
    }
    updateStatus(id, status, adminName) {
        return this.supportService.updateStatus(+id, status, adminName || 'Système');
    }
    assignTicket(id, adminId, adminName, assigneeName) {
        return this.supportService.assignTicket(+id, adminId, adminName, assigneeName);
    }
    addMessage(id, addMessageDto, authorName, sender) {
        return this.supportService.addMessage(+id, addMessageDto, authorName || 'Anonyme', sender || 'admin');
    }
    publicTracking(ticketNumber, email) {
        return this.supportService.findByTrackingInfo(ticketNumber, email);
    }
    async handleEmailReply(inboundEmailPayload) {
        console.log('[WEBHOOK EMAIL] Reçu un email entrant à parser plus tard :', inboundEmailPayload.subject);
        return { status: 'received' };
    }
};
exports.SupportController = SupportController;
__decorate([
    (0, common_1.Post)('tickets'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage,
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(pdf|doc|docx|jpg|jpeg|png|zip)$/i)) {
                return cb(new common_1.BadRequestException('Format de fichier non supporté'), false);
            }
            cb(null, true);
        }
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [support_dto_1.CreateTicketDto, Object]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('analytics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Post)('reports/generate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "generateReport", null);
__decorate([
    (0, common_1.Get)('reports'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "getReports", null);
__decorate([
    (0, common_1.Delete)('reports/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "deleteReport", null);
__decorate([
    (0, common_1.Get)('notifications'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Get)('tickets'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('tickets/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('tickets/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('adminName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)('tickets/:id/assign'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('adminId')),
    __param(2, (0, common_1.Body)('adminName')),
    __param(3, (0, common_1.Body)('assigneeName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, String]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "assignTicket", null);
__decorate([
    (0, common_1.Post)('tickets/:id/messages'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)('authorName')),
    __param(3, (0, common_1.Body)('sender')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, support_dto_1.AddMessageDto, String, String]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "addMessage", null);
__decorate([
    (0, common_1.Post)('suivi'),
    __param(0, (0, common_1.Body)('ticket_number')),
    __param(1, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "publicTracking", null);
__decorate([
    (0, common_1.Post)('webhook/email-reply'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "handleEmailReply", null);
exports.SupportController = SupportController = __decorate([
    (0, common_1.Controller)('support'),
    __metadata("design:paramtypes", [support_service_1.SupportService,
        support_report_service_1.SupportReportService])
], SupportController);
//# sourceMappingURL=support.controller.js.map