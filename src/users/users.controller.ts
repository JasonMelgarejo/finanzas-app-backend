import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@CurrentUser() user) {
        return user;
    }

    @Post('register')
    async registerUser(@Body() dto: CreateUserDto) {
        const validUser = await this.usersService.createUser(dto);
        
        return {
            user: validUser,
            message: "Usuario registrado exitosamente",
            success: true
        };
    }
}
