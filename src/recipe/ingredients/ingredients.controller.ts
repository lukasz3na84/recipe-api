import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { RefreshAuthGuard } from 'src/auth/auth/refresh.guards';
import { CreateIngredientDTO } from './dto/create-ingredient.dto';

@Controller('ingredients')
@UseGuards(RefreshAuthGuard)
export class IngredientsController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get(':id')
  async findOne(@Req() req, @Param('id', new ParseIntPipe()) id: number) {
    return this.ingredientService.findOne(req.user.id, id);
  }

  @Post()
  @UseGuards(RefreshAuthGuard)
  createOne(@Req() req, @Body() ingredient: CreateIngredientDTO) {
    return this.ingredientService.create(req.user.id, ingredient);
  }
}
