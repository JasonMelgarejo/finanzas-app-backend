import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) {}

    async saveCategory(dto: CreateCategoryDto) {
        try {
            const existing = await this.prisma.category.findFirst({
                where: {
                    name: dto.name,
                    transaction_type_id: dto.transaction_type_id
                }
            });

            if (existing) {
                throw new ConflictException('Ya existe una categoría con ese nombre para este tipo');
            }

            return await this.prisma.category.create({ data: { 
                name: dto.name, 
                transaction_type_id: dto.transaction_type_id, 
                is_default: dto.is_default
            }, select: { id: true, name: true } });
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new InternalServerErrorException('Error al crear la categoría');
        }
    }

    async updateCategory(id: number, dto: UpdateCategoryDto) {
        // 1️⃣ Verificar que exista
        const category = await this.prisma.category.findUnique({
            where: { id }
        });

        if (!category) {
            throw new NotFoundException('No se encontró la categoría');
        }

        // 2️⃣ Validar duplicado SOLO si vienen name y transaction_type_id
        if (dto.name || dto.transaction_type_id) {
            const existing = await this.prisma.category.findFirst({
                where: {
                    id: { not: id }, // 👈 excluye el mismo registro
                    name: dto.name ?? category.name,
                    transaction_type_id: dto.transaction_type_id ?? category.transaction_type_id
                }
            });

            if (existing) {
                throw new ConflictException('Ya existe una categoría con ese nombre para este tipo');
            }
        }

        // 3️⃣ Update parcial
        return this.prisma.category.update({
            where: { id },
            data: dto
        });
    }

    async getCategory(id: number) {
        const category = await this.prisma.category.findUnique({ 
            where: { id },
            include: {
                transaction_type: true
            }
        });

        if (!category) {
            throw new NotFoundException('No se encontro la categoría');
        }

        return category;
    }

    async listCategories() {
        const categories = await this.prisma.category.findMany({ 
            select: {
                id: true,
                name: true,
                is_default: true,
                transaction_type: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        return categories;
    }
}
