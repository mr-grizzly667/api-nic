import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Registrar } from '@prisma/client';

@Injectable()
export class RegistrarsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.RegistrarCreateInput): Promise<Registrar> {
    return this.prisma.registrar.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.RegistrarWhereInput;
    orderBy?: Prisma.RegistrarOrderByWithRelationInput;
  }): Promise<Registrar[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.registrar.findMany({
      skip,
      take,
      where,
      orderBy: orderBy || { order_position: 'asc' },
    });
  }

  async findOne(id: number): Promise<Registrar> {
    const registrar = await this.prisma.registrar.findUnique({
      where: { id },
    });
    if (!registrar) {
      throw new NotFoundException(`Registrar with ID ${id} not found`);
    }
    return registrar;
  }

  async update(id: number, data: Prisma.RegistrarUpdateInput): Promise<Registrar> {
    return this.prisma.registrar.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Registrar> {
    return this.prisma.registrar.delete({
      where: { id },
    });
  }
}
