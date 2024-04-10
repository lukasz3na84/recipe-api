import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Dish } from './dish.entity';
import { CreateDishDTO } from './dto/create-dish.dto';
import { UpdateDishDTO } from './dto/update-dish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UserService } from 'src/auth/user/user.service';
import slugify from 'slugify';
import { FilterQueryDto } from 'src/common/dto/filter-query.dto';

@Injectable()
export class DishService {
  // InjectRepository(Dish) - wprowadzenie "repository pattern"
  // nie jest wtedy potrzebne:
  // const newDish: Dish = new Dish();
  // Object.assign(newDish, dish);
  constructor(
    @InjectRepository(Dish) private dishRepository: Repository<Dish>,
    private readonly userService: UserService,
  ) {}

  async getOneDishById(userId: number, id: number): Promise<Dish> {
    const dish = await Dish.findOne({
      where: [{ id, userId }, { isPublic: true }],
      relations: ['user', 'ingredients', 'ingredients.product'],
    });
    if (!dish) {
      throw new NotFoundException(`Dish id: ${id} not found or is not public`);
    }
    return dish;
  }

  async create(userId: number, dish: CreateDishDTO): Promise<Dish> {
    const user = await this.userService.getOneById(userId);
    const slug = await this.generateSlug(dish.name);
    return await this.dishRepository.save({ ...dish, slug, user });
  }

  async read(
    userId: number,
    filters: FilterQueryDto<Dish>,
  ): Promise<{ result: Dish[]; total: number }> {
    const [result, total] = await this.dishRepository.findAndCount({
      take: filters.limit,
      skip: filters.offset,
      order: { [filters.orderBy]: filters.order },
      join: {
        alias: 'dish',
        leftJoinAndSelect: {
          ingredients: 'dish.ingredients',
          product: 'ingredients.product',
        },
      },
      where: [
        {
          name: Like('%' + filters.query + '%'),
          isPublic: true,
        },
        {
          name: Like('%' + filters.query + '%'),
          userId: userId,
        },
      ],
    });
    return {
      result,
      total,
    };
  }

  async update(userId: number, dishId: number, dish: UpdateDishDTO) {
    const { id, userId: dishUserId } = await this.getOneDishById(
      userId,
      dishId,
    );
    if (!id) {
      throw new NotFoundException('Dish not found');
    }
    if (userId !== dishUserId) {
      throw new ForbiddenException('You are not allowed to update this dish');
    }
    await this.dishRepository.update(dishId, dish);
    return this.getOneDishById(userId, dishId);
  }

  async delete(userId: number, dishId: number): Promise<{ success: boolean }> {
    const dishToRemove = await this.getOneDishById(userId, dishId);
    if (!dishToRemove) {
      throw new NotFoundException('Dish not found');
    }

    if (dishToRemove.userId !== userId) {
      throw new ForbiddenException('You cannot delete this dish');
    }
    const { affected } = await this.dishRepository.delete(dishId);
    return affected ? { success: true } : { success: false };
  }

  async generateSlug(name: string) {
    let slug = slugify(name, {
      replacement: '-',
      lower: true,
    });
    const exists = await this.findSlugs(slug);
    if (!exists || exists.length === 0) {
      return slug;
    }
    slug = slug + '-' + exists.length;
    return slug;
  }

  private async findSlugs(slug: string): Promise<Dish[]> {
    return await this.dishRepository
      .createQueryBuilder('dish')
      .where('slug LIKE :slug', { slug: `${slug}%` })
      .getMany();
  }

  async getOneOf(userId: number, id: number): Promise<Dish> {
    const dish = await this.dishRepository.findOne({
      where: { id, userId },
    });
    if (!dish) {
      throw new NotFoundException('Dish not found');
    }
    return dish;
  }
}
