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
var DomainsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let DomainsService = DomainsService_1 = class DomainsService {
    prisma;
    logger = new common_1.Logger(DomainsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkAvailability(query) {
        let raw = query.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '');
        if (!raw.endsWith('.ci')) {
            raw += '.ci';
        }
        try {
            const result = await this.queryRDAP(raw);
            await this.prisma.domainSearchLog.create({
                data: {
                    domain: raw,
                    available: result.available
                }
            }).catch(e => this.logger.error("Failed to log domain search", e.message));
            if (!result.available) {
                const parts = raw.split('.');
                const baseName = parts[0];
                const suggestionSuffixes = ['-online.ci', '-digital.ci', '-tech.ci', 'group.ci', 'pro.ci', '-web.ci'];
                const suggestionsToCheck = suggestionSuffixes.map(ext => `${baseName}${ext}`);
                const suggestions = await Promise.allSettled(suggestionsToCheck.map(sugDomain => this.queryRDAP(sugDomain)));
                result.suggestions = suggestions.map((res, index) => {
                    if (res.status === 'fulfilled') {
                        return { domain: res.value.domain, available: res.value.available };
                    }
                    return { domain: suggestionsToCheck[index], available: false };
                });
            }
            return result;
        }
        catch (error) {
            this.logger.error(`Error checking WHOIS for ${raw}: ${error.message}`, error.stack);
            throw new common_1.ServiceUnavailableException("Le service de vérification est momentanément indisponible.");
        }
    }
    async queryRDAP(domain) {
        const rdapUrl = `https://whois.nic.ci/domain/${domain}`;
        const response = await fetch(rdapUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        if (response.status === 404) {
            return { domain, available: true };
        }
        if (!response.ok) {
            throw new Error(`RDAP request failed with status ${response.status}`);
        }
        const data = await response.json();
        let creationDate;
        let expirationDate;
        let registrar;
        let nameservers = [];
        let status = data.status || [];
        if (data.events && Array.isArray(data.events)) {
            const regEvent = data.events.find((e) => e.eventAction === 'registration');
            if (regEvent)
                creationDate = regEvent.eventDate;
            const expEvent = data.events.find((e) => e.eventAction === 'expiration');
            if (expEvent)
                expirationDate = expEvent.eventDate;
        }
        if (data.entities && Array.isArray(data.entities)) {
            const regEntity = data.entities.find((e) => e.roles && e.roles.includes('registrar'));
            if (regEntity) {
                let vcardArray = regEntity.vcardArray;
                if (!vcardArray && regEntity.entities && Array.isArray(regEntity.entities)) {
                    const nestedEntity = regEntity.entities.find((e) => e.vcardArray);
                    if (nestedEntity)
                        vcardArray = nestedEntity.vcardArray;
                }
                if (vcardArray && vcardArray[1]) {
                    const fnField = vcardArray[1].find((f) => f[0] === 'fn');
                    if (fnField) {
                        registrar = fnField[3];
                    }
                }
                if (!registrar && regEntity.handle) {
                    registrar = regEntity.handle;
                }
            }
        }
        if (data.nameservers && Array.isArray(data.nameservers)) {
            nameservers = data.nameservers.map((ns) => ns.ldhName || ns.unicodeName).filter(Boolean);
        }
        return {
            domain,
            available: false,
            creationDate,
            expirationDate,
            registrar,
            nameservers,
            status
        };
    }
};
exports.DomainsService = DomainsService;
exports.DomainsService = DomainsService = DomainsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DomainsService);
//# sourceMappingURL=domains.service.js.map