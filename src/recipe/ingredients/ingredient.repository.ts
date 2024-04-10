import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient } from './ingridient.entity';

@Injectable()
export class IngredientRepository {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  async findOneById(id: number): Promise<Ingredient> {
    return await this.ingredientRepository
      .createQueryBuilder('ingredient')
      .innerJoinAndSelect('ingredient.dish', 'dish')
      .innerJoinAndSelect('ingredient.product', 'product')
      .where('ingredient.id = :id', { id })
      .getOne();
  }

  async findOne(userId: number, id: number): Promise<Ingredient> {
    const ingredient = await this.ingredientRepository.findOne({
      where: [{ id }],
      relations: ['dish', 'product'],
    });
    if (
      !ingredient ||
      (ingredient.dish.userId !== userId && !ingredient.dish.isPublic)
    ) {
      throw new NotFoundException(`Ingredient with ${id} not found`);
    }
    return ingredient;
  }

  async save(ingredientData): Promise<Ingredient> {
    return await this.ingredientRepository.save(ingredientData);
  }
}
