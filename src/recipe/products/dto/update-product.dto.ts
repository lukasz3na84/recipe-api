import { IsNumber, IsString } from 'class-validator';

export class UpdateProductDTO {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  unit: 'kg' | 'g' | 'tsp' | 'sp' | 'pinch' | 'ml' | 'l' | 'item';
}
