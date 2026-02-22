import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Post('register')
    async registerUser(@Body() dto: CreateUserDto) {
        const validUser = await this.authService.createUser(dto);
        
        return {
            user: validUser,
            message: "Usuario registrado exitosamente",
            success: true
        };
    }
}
