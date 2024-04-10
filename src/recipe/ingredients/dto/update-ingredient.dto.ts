import { IsNumber } from 'class-validator';

export class UpdateIngredientDTO {
  @IsNumber()
  id: number;

  @IsNumber({}, { message: 'Amount must be a number' })
  amount: number;

  @IsNumber()
  dishId: number;

  @IsNumber()
  productId: number;
}
