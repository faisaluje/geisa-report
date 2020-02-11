import { IsString, Length, IsNotEmpty } from 'class-validator'

export class AuthUserDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  password: string
}