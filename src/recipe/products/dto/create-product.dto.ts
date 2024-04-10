import { OmitType } from '@nestjs/mapped-types';
import { UpdateProductDTO } from './update-product.dto';

export class CreateProductDTO extends OmitType(UpdateProductDTO, [
  'id',
] as const) {}
