import { PrismaService } from '../prisma.service';
import { Prisma, Registrar } from '@prisma/client';
export declare class RegistrarsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.RegistrarCreateInput): Promise<Registrar>;
    findAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.RegistrarWhereInput;
        orderBy?: Prisma.RegistrarOrderByWithRelationInput;
    }): Promise<Registrar[]>;
    findOne(id: number): Promise<Registrar>;
    update(id: number, data: Prisma.RegistrarUpdateInput): Promise<Registrar>;
    remove(id: number): Promise<Registrar>;
}
