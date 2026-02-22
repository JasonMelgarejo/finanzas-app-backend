import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private prisma: PrismaService
    ) {}

    async login(dto: LoginDto) {
        const user = await this.usersService.validateUser(dto);

        if (!user) {
            throw new UnauthorizedException({
                message: 'Credenciales inválidas',
                success: false
            });
        }

        const payload = { sub: user.id };

        return {
            message: 'Login correcto',
            accessToken: this.jwtService.sign(payload),
            success: true
        };
    }

    async createUser(dto: CreateUserDto) {
        try {
            const hash = await bcrypt.hash(dto.password, 10);
            return await this.prisma.users.create({ data: { nombre: dto.nombre, apellido: dto.apellido, email: dto.email, password: hash }, select: { id: true, email: true } });;
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException({
                    message: 'El email ingresado ya se encuentra registrado',
                    field: error.meta?.target,
                    success: false
                });
            }
        }
    }
}
