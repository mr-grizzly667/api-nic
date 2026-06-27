"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                job_title: true,
                role: true,
                avatar: true,
                language: true,
                theme: true,
                default_admin_page: true,
                last_login: true,
                password_changed_at: true,
                created_at: true
            }
        });
        if (!user)
            throw new common_1.NotFoundException('Utilisateur introuvable');
        return user;
    }
    async updateProfile(userId, data) {
        if (data.email) {
            const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
            if (existing && existing.id !== userId) {
                throw new common_1.BadRequestException('Cet email est déjà utilisé.');
            }
        }
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                phone: data.phone,
                job_title: data.job_title
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                job_title: true,
                role: true,
                avatar: true,
                language: true,
                theme: true,
                default_admin_page: true,
                last_login: true,
                created_at: true
            }
        });
        await this.logActivity(userId, 'Profil mis à jour', 'User', userId);
        return user;
    }
    async updateAvatar(userId, fileUrl) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user?.avatar) {
            const oldPath = path.join(process.cwd(), user.avatar.replace(/^\//, ''));
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: { avatar: fileUrl },
            select: { id: true, avatar: true }
        });
        await this.logActivity(userId, 'Photo de profil modifiée', 'User', userId);
        return updatedUser;
    }
    async updatePreferences(userId, data) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data,
            select: { language: true, theme: true, default_admin_page: true }
        });
        await this.logActivity(userId, 'Préférences mises à jour', 'User', userId);
        return user;
    }
    async getActivity(userId) {
        return this.prisma.activityLog.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' },
            take: 10
        });
    }
    async getStats(userId) {
        const newsCount = await this.prisma.news.count({ where: { author_id: userId } });
        const docsCount = await this.prisma.document.count({ where: { created_by: userId } });
        const ticketsCount = await this.prisma.supportTicket.count({ where: { assigned_to: userId } });
        const lastActivity = await this.prisma.activityLog.findFirst({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' }
        });
        return {
            newsPublished: newsCount,
            documentsAdded: docsCount,
            ticketsHandled: ticketsCount,
            lastActivityDate: lastActivity?.created_at || null
        };
    }
    async changePassword(userId, currentPass, newPass) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Utilisateur introuvable');
        const isValid = await bcrypt.compare(currentPass, user.password);
        if (!isValid)
            throw new common_1.BadRequestException('Mot de passe actuel incorrect');
        const hashed = await bcrypt.hash(newPass, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                password: hashed,
                password_changed_at: new Date()
            }
        });
        await this.logActivity(userId, 'Mot de passe modifié', 'User', userId);
        return { success: true };
    }
    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                role: true,
                is_active: true,
                last_login: true,
                created_at: true
            },
            orderBy: { created_at: 'desc' }
        });
    }
    async createUser(data) {
        const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existing)
            throw new common_1.BadRequestException('Cet email est déjà utilisé.');
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const names = data.name.split(' ');
        const first_name = names[0];
        const last_name = names.slice(1).join(' ') || '';
        return this.prisma.user.create({
            data: {
                first_name,
                last_name,
                email: data.email,
                password: hashedPassword,
                role: data.role === 'Admin' ? 'admin' : 'editor',
                is_active: data.status === 'Actif',
            },
            select: { id: true, email: true, first_name: true, last_name: true, role: true, is_active: true }
        });
    }
    async updateUser(id, data) {
        if (data.email) {
            const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
            if (existing && existing.id !== id)
                throw new common_1.BadRequestException('Cet email est déjà utilisé.');
        }
        const updateData = {
            email: data.email,
            role: data.role === 'Admin' ? 'admin' : 'editor',
            is_active: data.status === 'Actif',
        };
        if (data.name) {
            const names = data.name.split(' ');
            updateData.first_name = names[0];
            updateData.last_name = names.slice(1).join(' ') || '';
        }
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }
        return this.prisma.user.update({
            where: { id },
            data: updateData,
            select: { id: true, email: true, first_name: true, last_name: true, role: true, is_active: true }
        });
    }
    async removeUser(id) {
        return this.prisma.user.delete({ where: { id } });
    }
    async logActivity(userId, action, entityType, entityId) {
        await this.prisma.activityLog.create({
            data: {
                user_id: userId,
                action,
                entity_type: entityType,
                entity_id: entityId
            }
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map