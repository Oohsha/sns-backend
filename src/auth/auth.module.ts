// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // 추가
import { JwtStrategy } from './jwt.strategy'; // 추가

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // 추가
    JwtModule.register({
      secret: 'MY_SECRET_KEY',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // JwtStrategy를 providers에 추가
})
export class AuthModule {}