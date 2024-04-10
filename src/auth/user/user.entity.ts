import { Exclude } from 'class-transformer';
import { Dish } from 'src/recipe/dishes/dish.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  @Exclude()
  password: string;

  @OneToMany(() => Dish, (dish: Dish) => dish.user)
  dishes: Dish;

  @Column({ type: 'varchar' })
  @Exclude()
  refreshToken: string;
}
