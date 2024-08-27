import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.stategy';
import { jwtConstants } from './constants';

const jwtModule = JwtModule.registerAsync({
  imports: [ConfigModule], // 确保 ConfigModule 被导入
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get(jwtConstants.secret),
      signOptions: { expiresIn: '60s' }, // 设置token过期时间
    };
  },
});

@Module({
  imports: [ConfigModule, jwtModule, UsersModule, PassportModule],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService, jwtModule], // 确保 AuthService 被导出
  controllers: [AuthController],
})
export class AuthModule {}
