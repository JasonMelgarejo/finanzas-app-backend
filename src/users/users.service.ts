import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async validateUser(dto: LoginDto) {
        const user = await this.prisma.users.findFirst({
            where: { email: dto.email },
        });

        console.log("user", user);

        if (!user) return null;

        const passwordIsValid = await bcrypt.compare(
            dto.password,
            user.password,
        );

        if (!passwordIsValid) return null;

        // Nunca devolver la contraseña
        const { password, ...result } = user;
        return result;
    }

    async createUser(dto: CreateUserDto) {
        try {
            const hash = await bcrypt.hash(dto.password, 10);
            return await this.prisma.users.create({ data: { email: dto.email, password: hash }, select: { id: true, email: true } });;
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException({
                    message: 'Registro duplicado',
                    field: error.meta?.target,
                    success: false
                });
            }
        }
    }
}
