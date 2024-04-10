/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Dish } from './dish.entity';
import { UpdateDishDTO } from './dto/update-dish.dto';
import { CreateDishDTO } from './dto/create-dish.dto';
import { DishService } from './dish.service';
import { RefreshAuthGuard } from 'src/auth/auth/refresh.guards';
import { FilterQueryDto } from 'src/common/dto/filter-query.dto';
import { FilterBy } from 'src/common/decorators/filter-by.decorator';

@Controller('dishes')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(RefreshAuthGuard)
export class DishesController {
  private dishService;

  constructor(dishService: DishService) {
    this.dishService = dishService;
  }

  @Post()
  createOne(@Req() req, @Body() dish: CreateDishDTO) {
    return this.dishService.create(req.user.id, dish);
  }

  @Get()
  readAll(@Req() req, @FilterBy<Dish>() filters: FilterQueryDto<Dish>) {
    //limit, offset, orderBy, order (asc, desc), query
    return this.dishService.read(req.user.id, filters);
  }

  @Get(':id')
  readOne(@Req() req, @Param('id', ParseIntPipe) dishId: number) {
    return this.dishService.getOneDishById(req.user.id, dishId);
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('id', ParseIntPipe) dishId,
    @Body() dish: UpdateDishDTO,
  ) {
    return this.dishService.update(req.user.id, dishId, dish);
  }

  @Delete(':id')
  deleteOne(@Req() req, @Param('id', ParseIntPipe) dishId: number) {
    return this.dishService.delete(req.user.id, dishId);
  }

  @Get('/exception')
  exampleException() {
    throw new HttpException('My super sample', HttpStatus.PAYLOAD_TOO_LARGE);
  }
}
