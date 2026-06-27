import { DomainsService } from './domains.service';
export declare class DomainsController {
    private readonly domainsService;
    constructor(domainsService: DomainsService);
    search(query: string): Promise<import("./domains.service").DomainCheckResult>;
}
