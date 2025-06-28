import { IsDate, IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 100)
  firstName: string;

  @IsString()
  @Length(1, 100)
  lastName: string;

  @IsDate()
  dateOfBirth: Date;

  @IsEmail()
  @Length(5, 50)
  email: string;

  @IsString()
  @Length(6, 100)
  password: string;

  @IsString()
  @Length(1, 100)
  role: string;

  // @IsOptional()
  // @IsString()
  // @Length(1, 10)
  // phone?: string;
}
