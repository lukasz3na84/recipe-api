TYPEORM
Migracje:
### Create ##
npm run typeorm migration:create ./src/database/migrations/CreateProductTable

### migrate ###
packege.json

    "migrate": "NODE_ENV=development typeorm-ts-node-esm migration:run --dataSource src/config/database.config",
    "migrate:revert": "NODE_ENV=development typeorm-ts-node-esm migration:revert --dataSource src/config/database.config"

### database.config.ts ###
dodano sekcję z kodem:
DataSource

### wygenerowanie JWT_SECRET_TOKEN'a w node
w konsoli:
node
require('crypto').randomBytes(256).toString('base64')

### Cookie ###
httpOnly - cookie które bedzie dołaczane do odpowiedzi, do każdego zapytania tak długo, aż bedzie aktywne

### Decoratory ###
nest g d filterBy - utworzenie w katalogu w ktorym jestesmy decoratora

### Middleware ###
Nowy Middleware dodajemy w app.module lub innym posrednim:

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}