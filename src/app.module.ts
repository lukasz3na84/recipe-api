import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RecipeModule } from './recipe/recipe.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './config/database.config';
import { envValidation } from './config/envValidation';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { HttpFilter } from './common/filters/http/http.filter';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 1,
        limit: 1,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      validationSchema: envValidation,
    }),
    TypeOrmModule.forRootAsync(databaseConfig),
    RecipeModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

// @Module({
//   imports: [
//     RecipeModule,
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: 'localhost',
//       port: 5434,
//       username: 'postgres',
//       password: 'admin',
//       database: 'nestjs',
//       autoLoadEntities: true,
//       synchronize: true, // true- not for production[!]
//     }),
//     UserModule,
//   ],
//   controllers: [AppController],
//   providers: [],
// })
// export class AppModule {}
