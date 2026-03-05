import { Transform, Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateTransactionDto {
  @Type(() => Number)
  @IsInt({ message: 'amount debe ser un número entero' })
  @IsPositive({ message: 'amount debe ser mayor que 0' })
  amount: number;

  @Type(() => Number)
  @IsInt({ message: 'category_id debe ser un número entero' })
  @IsPositive({ message: 'category_id debe ser mayor que 0' })
  category_id: number;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'La descripción no debe superar los 255 caracteres' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @Type(() => Date)
  @IsDate({ message: 'transaction_date debe ser una fecha válida' })
  transaction_date: Date;
}