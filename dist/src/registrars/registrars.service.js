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
exports.RegistrarsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let RegistrarsService = class RegistrarsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.registrar.create({ data });
    }
    async findAll(params) {
        const { skip, take, where, orderBy } = params;
        return this.prisma.registrar.findMany({
            skip,
            take,
            where,
            orderBy: orderBy || { order_position: 'asc' },
        });
    }
    async findOne(id) {
        const registrar = await this.prisma.registrar.findUnique({
            where: { id },
        });
        if (!registrar) {
            throw new common_1.NotFoundException(`Registrar with ID ${id} not found`);
        }
        return registrar;
    }
    async update(id, data) {
        return this.prisma.registrar.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return this.prisma.registrar.delete({
            where: { id },
        });
    }
};
exports.RegistrarsService = RegistrarsService;
exports.RegistrarsService = RegistrarsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RegistrarsService);
//# sourceMappingURL=registrars.service.js.map