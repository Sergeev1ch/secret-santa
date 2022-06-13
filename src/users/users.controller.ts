import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ValidationPipe } from '../pipes/validation.pipe';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './users.model';
import {
  swaggerResponseCreated,
  swaggerResponseCreatedError,
  swaggerResponseRestart,
  swaggerResponseShuffle,
  swaggerResponseShuffleBad,
  swaggerResponseShuffleMethod,
  swaggerResponseUserNotFound,
} from 'src/swagger/swaggerResponse';

@ApiTags('Secret Santa system')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Created user' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    type: swaggerResponseCreated,
    description: 'User successfully created',
  })
  @ApiBadRequestResponse({
    type: swaggerResponseCreatedError,
    description:
      'The user was not created because registration for the game has ended or the maximum number of participants has been reached',
  })
  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Get a user by their id' })
  @ApiOkResponse({
    type: User,
    description: 'The user who is assigned to you as a couple',
  })
  @ApiNotFoundResponse({
    type: swaggerResponseUserNotFound,
    description: 'The game has not yet ended or the user has not been found',
  })
  @Get(':id')
  getRecipient(@Param('id') id: number) {
    return this.usersService.getUserRecepient(id);
  }

  @ApiOperation({ summary: 'Generate user pairs' })
  @ApiOkResponse({
    type: swaggerResponseShuffle,
    description:
      'Registration for the game is completed. Users are divided into pairs',
  })
  @ApiBadRequestResponse({
    type: swaggerResponseShuffleBad,
    description: 'Not enough members to start',
  })
  @ApiMethodNotAllowedResponse({
    type: swaggerResponseShuffleMethod,
    description: 'Re-mixing is not allowed',
  })
  @Post('/shuffle')
  shuffle() {
    return this.usersService.usersShuffle();
  }

  @ApiOperation({ summary: 'Restarted game' })
  @ApiOkResponse({
    type: swaggerResponseRestart,
    description: 'Game restarted',
  })
  @Delete('/reset')
  reset() {
    return this.usersService.resetUsers();
  }
}
