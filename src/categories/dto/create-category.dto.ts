import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(50, { message: 'El nombre no debe superar los 50 caracteres' })
  @Transform(({ value }) => value.trim())
  name: string;

  @Type(() => Number)
  @IsInt({ message: 'transaction_type_id debe ser un número entero' })
  @IsPositive({ message: 'transaction_type_id debe ser mayor que 0' })
  transaction_type_id: number;

  @Type(() => Boolean)
  @IsBoolean({ message: 'is_default debe ser booleano' })
  is_default: boolean;
}