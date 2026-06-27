import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export interface DomainCheckResult {
  domain: string;
  available: boolean;
  status?: string[];
  creationDate?: string;
  expirationDate?: string;
  registrar?: string;
  nameservers?: string[];
  suggestions?: { domain: string; available: boolean }[];
}

@Injectable()
export class DomainsService {
  private readonly logger = new Logger(DomainsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async checkAvailability(query: string): Promise<DomainCheckResult> {
    let raw = query.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '');
    if (!raw.endsWith('.ci')) {
      raw += '.ci';
    }

    try {
      const result = await this.queryRDAP(raw);
      
      // Log search
      await this.prisma.domainSearchLog.create({
        data: {
          domain: raw,
          available: result.available
        }
      }).catch(e => this.logger.error("Failed to log domain search", e.message));

      // Generate suggestions only if unavailable to save API calls? 
      // The user said: "Si le domaine recherché est indisponible : Exemple : orange.ci Générer automatiquement : orange-online.ci..."
      if (!result.available) {
        const parts = raw.split('.');
        const baseName = parts[0];
        const suggestionSuffixes = ['-online.ci', '-digital.ci', '-tech.ci', 'group.ci', 'pro.ci', '-web.ci'];
        const suggestionsToCheck = suggestionSuffixes.map(ext => `${baseName}${ext}`);
        
        // Parallel checks for suggestions
        const suggestions = await Promise.allSettled(
          suggestionsToCheck.map(sugDomain => this.queryRDAP(sugDomain))
        );
        
        result.suggestions = suggestions.map((res, index) => {
          if (res.status === 'fulfilled') {
            return { domain: res.value.domain, available: res.value.available };
          }
          // If suggestion check failed, default to unavailable
          return { domain: suggestionsToCheck[index], available: false };
        });
      }

      return result;

    } catch (error) {
      this.logger.error(`Error checking WHOIS for ${raw}: ${error.message}`, error.stack);
      throw new ServiceUnavailableException("Le service de vérification est momentanément indisponible.");
    }
  }

  private async queryRDAP(domain: string): Promise<DomainCheckResult> {
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
    
    let creationDate: string | undefined;
    let expirationDate: string | undefined;
    let registrar: string | undefined;
    let nameservers: string[] = [];
    let status: string[] = data.status || [];

    if (data.events && Array.isArray(data.events)) {
      const regEvent = data.events.find((e: any) => e.eventAction === 'registration');
      if (regEvent) creationDate = regEvent.eventDate;
      
      const expEvent = data.events.find((e: any) => e.eventAction === 'expiration');
      if (expEvent) expirationDate = expEvent.eventDate;
    }

    if (data.entities && Array.isArray(data.entities)) {
      const regEntity = data.entities.find((e: any) => e.roles && e.roles.includes('registrar'));
      if (regEntity) {
        // Look for vcardArray directly or in nested entities
        let vcardArray = regEntity.vcardArray;
        if (!vcardArray && regEntity.entities && Array.isArray(regEntity.entities)) {
          const nestedEntity = regEntity.entities.find((e: any) => e.vcardArray);
          if (nestedEntity) vcardArray = nestedEntity.vcardArray;
        }

        if (vcardArray && vcardArray[1]) {
          const fnField = vcardArray[1].find((f: any) => f[0] === 'fn');
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
      nameservers = data.nameservers.map((ns: any) => ns.ldhName || ns.unicodeName).filter(Boolean);
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
}
