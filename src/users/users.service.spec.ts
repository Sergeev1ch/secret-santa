import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './users.model';
import { getModelToken } from '@nestjs/sequelize';
import { HttpStatus } from '@nestjs/common';
import { jest } from '@jest/globals';

const testUser = {
  id: 1,
  firstname: 'Sergey',
  lastname: 'Platonenko',
  wishList: ['test'],
};

describe('Test Service', () => {
  let usersService: UsersService;

  const UserCount = jest.fn();
  const FindUser = jest.fn(() => testUser);
  const FindAndCount = jest.fn().mockReturnValue({
    count: 4,
    rows: [testUser, testUser, testUser, testUser],
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: {
            count: UserCount,
            create: jest.fn(() => testUser),
            findByPk: FindUser,
            findAndCountAll: FindAndCount,
            update: jest.fn(),
            destroy: jest.fn(),
          },
        },
      ],
    }).compile();
    usersService = module.get<UsersService>(UsersService);
  });

  it('Unit Test create user', async () => {
    UserCount.mockReturnValue(0);
    expect(
      await usersService.createUser({
        firstname: 'Sergey',
        lastname: 'Platonenko',
        wishList: ['test'],
      }),
    ).toBe('Ваш id в системе: 1');
  });

  it('Unit Test create user when game closed', async () => {
    usersService.shuffled = true;
    await usersService
      .createUser({
        firstname: 'Sergey',
        lastname: 'Platonenko',
        wishList: ['test'],
      })
      .catch((error) => {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe('Регистрация на игру завершилась!');
      });
  });

  it('Unit Test create user when users limit', async () => {
    UserCount.mockReturnValue(usersService.MAX_PLAYER);
    await usersService
      .createUser({
        firstname: 'Sergey',
        lastname: 'Platonenko',
        wishList: ['test'],
      })
      .catch((error) => {
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe(
          'Достигнуто максимальное количество учасников!',
        );
      });
  });

  it('Unit Test find user', async () => {
    usersService.shuffled = true;
    expect(await usersService.getUserRecepient(1)).toBe(testUser);
  });

  it('Unit Test find user when game in progress', async () => {
    usersService.shuffled = false;
    await usersService.getUserRecepient(1).catch((error) => {
      expect(error.status).toBe(HttpStatus.NOT_FOUND);
      expect(error.message).toBe('Вам еще не назначена пара!');
    });
  });

  it('Unit Test find user when user not found', async () => {
    usersService.shuffled = true;
    FindUser.mockReturnValue(null);
    await usersService.getUserRecepient(1).catch((error) => {
      expect(error.status).toBe(HttpStatus.NOT_FOUND);
      expect(error.message).toBe('Пользователь с таким id не найден!');
    });
  });

  it('Unit Test shuffle user', async () => {
    usersService.shuffled = false;
    expect(await usersService.usersShuffle()).toBe(
      'Пары санта-получатель сформированы!',
    );
  });

  it('Unit Test shuffle user when users shuffled', async () => {
    usersService.shuffled = true;
    await usersService.usersShuffle().catch((error) => {
      expect(error.status).toBe(HttpStatus.METHOD_NOT_ALLOWED);
      expect(error.message).toBe('Повторное перемешивание недопустимо!');
    });
  });

  it('Unit Test shuffle user when users < 3', async () => {
    usersService.shuffled = false;
    FindAndCount.mockReturnValue({ count: 1, rows: [testUser] });
    await usersService.usersShuffle().catch((error) => {
      expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      expect(error.message).toBe('Недостаточно учасников для начала!');
    });
  });

  it('Unit Test reset game', async () => {
    expect(await usersService.resetUsers()).toBe('Игроки удалены!');
  });
});
