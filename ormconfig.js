// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { databaseConfig } = require('./src/config/database.config.ts');

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity.{ts,js}'],
  seeds: ['src/database/seeders/seeds/**/*{.ts,.js}'],
  factories: ['src/database/seeders/factories/**/*{.ts,.js}'],
};
