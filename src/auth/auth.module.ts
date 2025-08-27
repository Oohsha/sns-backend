// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
// ConfigModule과 ConfigService는 더 이상 여기서 직접 필요하지 않습니다.

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // 👇 registerAsync 대신 register를 사용하고, process.env를 직접 참조
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // JwtStrategy는 이제 ConfigService를 필요로 하지 않음
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}