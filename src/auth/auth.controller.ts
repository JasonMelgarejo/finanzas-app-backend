import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService: UsersService, private readonly usersService: UsersService) {}

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@CurrentUser() user) {
        return this.userService.getUser(user.userId);
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
