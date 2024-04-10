import { OmitType } from '@nestjs/mapped-types';
import { UpdateIngredientDTO } from './update-ingredient.dto';

export class CreateIngredientDTO extends OmitType(UpdateIngredientDTO, [
  'id',
] as const) {}
