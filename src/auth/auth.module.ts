import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshJwtStrategy } from './auth/rjwt.stategy';
import { JwtStrategy } from './auth/jwt.stategy';
import { PassportModule } from '@nestjs/passport';

//TypeOrmModule.forFeature([User])- zaciągnięcie encji User
//exports- użycie tych serwisów np. w module Recipe
//ConfigService - jest nam potrzebny aby dostać sie do zmiennych srodowiskowych

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_TOKEN'),
        signOptions: {
          expiresIn: `${configService.get<string>('JWT_EXPIRATION_SECRET')}`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, UserService, RefreshJwtStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, UserService],
})
export class AuthModule {}
