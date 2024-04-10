import { Injectable } from '@nestjs/common';
import { IngredientRepository } from './ingredient.repository';
import { Ingredient } from './ingridient.entity';
import { CreateIngredientDTO } from './dto/create-ingredient.dto';
import { DishService } from '../dishes/dish.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class IngredientService {
  constructor(
    private readonly ingredientRepository: IngredientRepository,
    private readonly dishService: DishService,
    private readonly productService: ProductsService,
  ) {}

  async findOne(userId: number, id: number): Promise<Ingredient> {
    return await this.ingredientRepository.findOne(userId, id);
  }

  async create(
    userId: number,
    ingredient: CreateIngredientDTO,
  ): Promise<Ingredient> {
    const dish = await this.dishService.getOneOf(userId, ingredient.dishId);
    const product = await this.productService.getOneProductByID(
      ingredient.productId,
    );

    return await this.ingredientRepository.save({
      ...ingredient,
      dish,
      product,
    });
  }
}
