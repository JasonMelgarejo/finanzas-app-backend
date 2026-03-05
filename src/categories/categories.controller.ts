import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private categoryService: CategoriesService) { }

    @UseGuards(JwtAuthGuard)
    @Post('save')
    async saveCategory(@Body() dto: CreateCategoryDto) {
        return this.categoryService.saveCategory(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateCategory(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
        return this.categoryService.updateCategory(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getCategory(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.getCategory(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async listCategories() {
        return this.categoryService.listCategories();
    }
}
