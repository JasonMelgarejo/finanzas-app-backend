import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'El nombre no debe superar los 50 caracteres' })
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'El apellido no debe superar los 50 caracteres' })
  apellido: string;

  @IsEmail({}, { message: 'El correo no es válido' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;
}