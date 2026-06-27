import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { PrismaService } from '../prisma.service';
import { SupportReportService } from './support-report.service';

@Module({
  controllers: [SupportController],
  providers: [SupportService, SupportReportService, PrismaService],
})
export class SupportModule {}
