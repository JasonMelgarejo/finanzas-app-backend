import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(50, { message: 'El nombre no debe superar los 50 caracteres' })
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'transaction_type_id debe ser un número entero' })
  @IsPositive({ message: 'transaction_type_id debe ser mayor que 0' })
  transaction_type_id?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'is_default debe ser booleano' })
  is_default?: boolean;
}