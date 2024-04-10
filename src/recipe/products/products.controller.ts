import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { DishService } from 'src/recipe/dishes/dish.service';
import { RefreshAuthGuard } from 'src/auth/auth/refresh.guards';
import { Product } from './product.entity';
import { FilterQueryDto } from 'src/common/dto/filter-query.dto';
import { FilterBy } from 'src/common/decorators/filter-by.decorator';

@Controller('products')
export class ProductsController {
  private dishService: DishService;
  private productService: ProductsService;

  constructor(dishService: DishService, productService: ProductsService) {
    this.dishService = dishService;
    this.productService = productService;
  }

  @Post()
  @UseGuards(RefreshAuthGuard)
  createOne(@Body() product: CreateProductDTO) {
    return this.productService.create(product);
  }

  @Get()
  readAll(
    @FilterBy<Product>()
    filters: FilterQueryDto<Product>,
  ) {
    return this.productService.read(filters);
  }

  @Put()
  updateOne(@Body() product: UpdateProductDTO) {
    return this.productService.update(product);
  }

  //ParseIntPipe ten tzw. pipe rzutuje parametr ze stringa na number
  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) productId: number) {
    return this.productService.delete(productId);
  }
}
