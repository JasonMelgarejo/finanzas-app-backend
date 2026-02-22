import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor() {}

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@CurrentUser() user) {
        return user;
    }
}
