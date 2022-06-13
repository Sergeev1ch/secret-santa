import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  shuffled = false;
  MIN_PLAYER = 3;
  MAX_PLAYER = 500;

  async createUser(dto: CreateUserDto) {
    const usersCount = await this.userRepository.count();

    if (this.shuffled) {
      throw new HttpException(
        'Регистрация на игру завершилась!',
        HttpStatus.BAD_REQUEST,
      );
    } else if (usersCount >= this.MAX_PLAYER) {
      throw new HttpException(
        'Достигнуто максимальное количество учасников!',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const user = await this.userRepository.create(dto);
      return 'Ваш id в системе: ' + user.id;
    }
  }

  async getUserRecepient(id: number) {
    const santa = await this.userRepository.findByPk(id);
    if (!santa) {
      throw new HttpException(
        'Пользователь с таким id не найден!',
        HttpStatus.NOT_FOUND,
      );
    }
    if (!this.shuffled) {
      throw new HttpException(
        'Вам еще не назначена пара!',
        HttpStatus.NOT_FOUND,
      );
    } else {
      const user = await this.userRepository.findByPk(santa.giftsFor);
      return user;
    }
  }

  async usersShuffle() {
    const users = await this.userRepository.findAndCountAll();

    if (users.count <= this.MIN_PLAYER) {
      throw new HttpException(
        'Недостаточно учасников для начала!',
        HttpStatus.BAD_REQUEST,
      );
    } else if (this.shuffled) {
      throw new HttpException(
        'Повторное перемешивание недопустимо!',
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    } else {
      users.rows.sort(() => Math.random() - 0.5);
      users.rows.map(async (user, index) => {
        if (index === users.count - 1) {
          await this.userRepository.update(
            { giftsFor: users.rows[0].id },
            { where: { id: users.rows[index].id } },
          );
        } else {
          await this.userRepository.update(
            { giftsFor: users.rows[index + 1].id },
            { where: { id: users.rows[index].id } },
          );
        }
      });
      this.shuffled = true;
      return 'Пары санта-получатель сформированы!';
    }
  }

  async resetUsers() {
    await this.userRepository.destroy({ where: {}, truncate: true });
    this.shuffled = false;

    return 'Игроки удалены!';
  }
}
