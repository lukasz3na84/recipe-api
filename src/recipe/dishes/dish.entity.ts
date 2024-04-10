import { User } from 'src/auth/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Ingredient } from '../ingredients/ingridient.entity';

@Entity()
export class Dish extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  slug: string;

  @Column({ type: 'decimal' })
  servings: number;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  @OneToMany(() => Ingredient, (ingredient: Ingredient) => ingredient.dish, {
    onDelete: 'CASCADE',
  })
  ingredients: Ingredient[];

  @ManyToOne(() => User, (user: User) => user.dishes, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'varchar' })
  createdAt: string;
}
