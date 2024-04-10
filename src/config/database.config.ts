import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { CreateUserTable1710496471554 } from '../database/migrations/1710496471554-CreateUserTable';
import { CreateDishTable1710776149310 } from '../database/migrations/1710776149310-CreateDishTable';
import { CreateProductTable1710775424899 } from '../database/migrations/1710775424899-CreateProductTable';
import { CreateIngredientTable1710778918899 } from '../database/migrations/1710778918899-CreateIngredientTable';

const env = process.env.NODE_ENV || 'development';
const dotenvPath = path.resolve(process.cwd(), `.env.${env}`);
dotenv.config({ path: dotenvPath });

class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USER'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'),
      autoLoadEntities: true,
      synchronize: false,
      migrationsRun: false,
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: [CreateUserTable1710496471554],
      // migrationsTableName: 'migrations',
    };
  }
}

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) =>
    TypeOrmConfig.getOrmConfig(configService),
  inject: [ConfigService],
};

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrationsRun: false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: [
    CreateUserTable1710496471554,
    CreateDishTable1710776149310,
    CreateProductTable1710775424899,
    CreateIngredientTable1710778918899,
  ],
  // migrationsTableName: 'migrations',
});

export default databaseConfig;
