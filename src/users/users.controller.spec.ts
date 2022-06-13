import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('Test Controller', () => {
  let controller: UsersController;
  let spyService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            getUserRecepient: jest.fn(),
            usersShuffle: jest.fn(),
            resetUsers: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    spyService = module.get<UsersService>(UsersService);
  });

  it('Unit Test create user', async () => {
    await controller.create(new CreateUserDto());
    expect(spyService.createUser).toHaveBeenCalled();
  });
  it('Unit Test get user', async () => {
    const id = 1;
    await controller.getRecipient(id);
    expect(spyService.getUserRecepient).toHaveBeenCalledWith(id);
  });
  it('Unit Test user mixing', async () => {
    await controller.shuffle();
    expect(spyService.usersShuffle).toHaveBeenCalled();
  });
  it('Unit Test reset game', async () => {
    await controller.reset();
    expect(spyService.resetUsers).toHaveBeenCalled();
  });
});
