import {
  Controller,
  UsePipes,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TransformerPipe } from './common/pipes/transformer/transformer.pipe';
import { AppGuard } from './common/guards/app/app.guard';
import { Admin } from './common/decorators/admin.decorator';
import { CustomException } from './common/exceptions/custom.exception';
import { WrapperInterceptor } from './common/interceptors/wrapper/wrapper.interceptor';

@Controller()
@UsePipes(TransformerPipe)
export class AppController {
  @Get('/user')
  @Admin()
  @UseGuards(AppGuard)
  getSample(@Query('name') name: string) {
    throw new CustomException();
    return { name };
  }

  @Get('/hello')
  @UseInterceptors(WrapperInterceptor)
  getHello(): string {
    console.log('Action...');
    return 'Hello';
  }

  @Post()
  createFruit(@Body() fruit: { name: string }) {
    return { fruit };
  }

  @Put()
  updateFruit(@Body() fruit: { name: string }) {
    return fruit;
  }

  @Delete(':fruitId')
  deleteFruit(@Param('fruitId') fruitId: string) {
    return { fruitId };
  }
}
