import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/dto/login.dto';

@Injectable()
export class UsersService {
    async validateUser(dto: LoginDto) {
        // Ejemplo con datos mock (luego irá Prisma)
        const user = {
            id: 1,
            email: dto.email,
            password: '$2a$12$qjqnYWpO23bTIW.RX/VbSOjenc6Aj35xvw0uzS6CVz2zaKlJIUj6i',
        };

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
