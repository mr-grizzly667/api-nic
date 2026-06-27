import { Module } from '@nestjs/common';
import { RegistrarsService } from './registrars.service';
import { RegistrarsController } from './registrars.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [RegistrarsController],
  providers: [RegistrarsService, PrismaService],
})
export class RegistrarsModule {}
