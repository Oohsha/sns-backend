// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport'; // 1. PassportModule import

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // 2. imports 배열에 추가
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}