import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async validateUser(dto: LoginDto) {
        const user = await this.prisma.users.findFirst({
            where: { email: dto.email },
        });

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
}
