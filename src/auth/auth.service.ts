import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async login(dto: LoginDto) {
        const user = await this.usersService.validateUser(dto);

        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload = { sub: user.id };

        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}
