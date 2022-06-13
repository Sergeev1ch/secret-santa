import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Sergey',
    type: String,
    minLength: 3,
  })
  @IsString({ message: 'Должно быть строкой!' })
  @MinLength(3, { message: 'Минимум 3 символа!' })
  readonly firstname: string;

  @ApiProperty({
    example: 'Platonenko',
    type: String,
    minLength: 3,
  })
  @IsString({ message: 'Должно быть строкой!' })
  @MinLength(3, { message: 'Минимум 3 символа!' })
  readonly lastname: string;

  @ApiProperty({
    example: ['test', 'test', 'test'],
    type: [String],
    minItems: 1,
    maxItems: 10,
  })
  @ArrayNotEmpty({ message: 'Не может быть пустым!' })
  @ArrayMaxSize(10, { message: 'Максимум 10 желаний' })
  @IsString({ each: true, message: 'Должно быть строкой!' })
  @MinLength(3, { each: true, message: 'Минимум 3 символа!' })
  readonly wishList: string[];
}
