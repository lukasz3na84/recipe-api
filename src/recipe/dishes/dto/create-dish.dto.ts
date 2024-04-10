import { UpdateDishDTO } from './update-dish.dto';
import { IsString } from 'class-validator';

// export class CreateDishDTO extends OmitType(UpdateDishDTO, ['id'] as const) {} - zapis gdy uzywalismy w updateid w body
export class CreateDishDTO extends UpdateDishDTO {
  @IsString()
  name: string;
}

//dodajemy "name"- poniewaz name w UpdateDishDTO a chcemy aby było wymagane wiec nadpisujemy to name
