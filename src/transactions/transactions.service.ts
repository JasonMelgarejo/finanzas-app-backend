import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
    constructor(private prisma: PrismaService) {}

    async saveTransaction(userId: number, dto: CreateTransactionDto) {
        try {
            return await this.prisma.transaction.create({ data: { 
                user_id: userId, 
                amount: dto.amount, 
                category_id: dto.category_id,
                description: dto.description ?? null,
                transaction_date: dto.transaction_date
            }, select: { id: true } });
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new InternalServerErrorException(`Error al crear el movimiento`);
        }
    }

    async updateTransactionByUser(userId: number, id: number, dto: UpdateTransactionDto) {
        // Verificar que exista
        const transaction = await this.prisma.transaction.findFirst({
            where: {
                id,
                user_id: userId
            }
        });

        if (!transaction) {
            throw new NotFoundException('No se encontró el movimiento');
        }

        // Update parcial
        return this.prisma.transaction.update({
            where: { id },
            data: dto
        });
    }

    async getTransactionByUser(userId: number, id: number) {
        const transaction = await this.prisma.transaction.findFirst({ 
            where: { 
                id,
                user_id: userId 
            },
            select: {
                id: true,
                amount: true,
                description: true,
                transaction_date: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                        transaction_type: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },
        });

        if (!transaction) {
            throw new NotFoundException('No se encontro el movimiento');
        }

        return transaction;
    }

    async listTransactionsByUser(userId: number) {
        const transactions = await this.prisma.transaction.findMany({ 
            where: {
                user_id: userId 
            },
            select: {
                id: true,
                amount: true,
                description: true,
                transaction_date: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                        transaction_type: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                transaction_date: 'desc'
            }
        });

        return transactions.map(t => ({
            ...t,
            amount: t.amount.toNumber(),
            transaction_date: t.transaction_date.toISOString().split('T')[0]
        }));
    }
}
