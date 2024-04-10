import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateDishDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Servings must be a number' })
  servings?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
