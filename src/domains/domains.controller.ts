import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { DomainsService } from './domains.service';

@Controller('domains')
export class DomainsController {
  constructor(private readonly domainsService: DomainsService) {}

  @Get('search')
  async search(@Query('q') query: string) {
    if (!query) {
      throw new BadRequestException('Query parameter "q" is required');
    }
    return this.domainsService.checkAvailability(query);
  }
}
