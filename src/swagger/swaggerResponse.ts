import { ApiProperty } from '@nestjs/swagger';

export class swaggerResponseCreated {
  @ApiProperty({ type: Number, example: 201 })
  code: number;

  @ApiProperty({ type: String, example: 'Ваш id в системе: 1' })
  message: string;
}

export class swaggerResponseCreatedError {
  @ApiProperty({ type: Number, example: 400 })
  code: number;

  @ApiProperty({
    type: String,
    example: [
      'Регистрация на игру завершилась!',
      'Достигнуто максимальное количество учасников!',
    ],
  })
  message: string;
}

export class swaggerResponseUserNotFound {
  @ApiProperty({ type: Number, example: 404 })
  code: number;

  @ApiProperty({
    type: String,
    example: [
      'Пользователь с таким id не найден!',
      'Вам еще не назначена пара!',
    ],
  })
  message: string;
}

export class swaggerResponseShuffle {
  @ApiProperty({ type: Number, example: 200 })
  code: number;

  @ApiProperty({ type: String, example: 'Пары санта-получатель сформированы!' })
  message: string;
}

export class swaggerResponseShuffleBad {
  @ApiProperty({ type: Number, example: 400 })
  code: number;

  @ApiProperty({ type: String, example: 'Недостаточно учасников для начала!' })
  message: string;
}

export class swaggerResponseShuffleMethod {
  @ApiProperty({ type: Number, example: 405 })
  code: number;

  @ApiProperty({
    type: String,
    example: 'Повторное перемешивание недопустимо!',
  })
  message: string;
}

export class swaggerResponseRestart {
  @ApiProperty({ type: Number, example: 200 })
  code: number;

  @ApiProperty({ type: String, example: 'Игроки удалены!' })
  message: string;
}
