import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.entity';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { FilterQueryDto } from 'src/common/dto/filter-query.dto';

@Injectable()
export class ProductsService {
  // @Inject(forwardRef) - wrzucamy w konstruktor kiedy DishService jest zalezny od ProductService i odwrotnie
  // to tzw. "circular dependency", przy "repositury pattern" nie jest potrzebny
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  // async getAllbyDishId(dishId: number): Product[] {
  //   return await this.products.filter((p: Product) => p.dishId === dishId);
  // }

  async getOneProductByID(productId: number): Promise<Product> {
    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Dish id: ${product.id} not found`);
    }
    return product;
  }

  async create(product: CreateProductDTO): Promise<Product> {
    // const newProduct: Product = new Product();
    // Object.assign(newProduct, product);
    const newProduct = await this.productRepository.create(product);
    return this.productRepository.save(newProduct);
  }

  async read(
    filters: FilterQueryDto<Product>,
  ): Promise<{ result: Product[]; total: number }> {
    const [result, total] = await this.productRepository.findAndCount({
      take: filters.limit,
      skip: filters.offset,
      order: {
        [filters.orderBy]: filters.order,
      },
      where: [{ name: Like('%' + filters.query) }],
    });

    return {
      result,
      total,
    };
  }

  async update(product: UpdateProductDTO) {
    const productToUpdate = await this.getOneProductByID(product.id);
    return this.productRepository.update(productToUpdate.id, productToUpdate);
  }

  async delete(productId: number): Promise<Product> {
    const productToRemove = await this.getOneProductByID(productId);
    return this.productRepository.remove(productToRemove);
  }
}
