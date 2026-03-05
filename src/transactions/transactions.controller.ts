import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@Controller('transactions')
export class TransactionsController {
    constructor(private transactionsService: TransactionsService) { }

    @UseGuards(JwtAuthGuard)
    @Post('save')
    async saveTransaction(@Body() dto: CreateTransactionDto, @CurrentUser() user) {
        return this.transactionsService.saveTransaction(user.userId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateTransactionByUser(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTransactionDto, @CurrentUser() user) {
        return this.transactionsService.updateTransactionByUser(user.userId, id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getTransactionByUser(@Param('id', ParseIntPipe) id: number, @CurrentUser() user) {
        return this.transactionsService.getTransactionByUser(user.userId, id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async listTransactionsByUser(@CurrentUser() user) {
        return this.transactionsService.listTransactionsByUser(user.userId);
    }
}
