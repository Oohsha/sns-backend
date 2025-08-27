// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 전역 모듈로 설정
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 다른 모듈에서 사용할 수 있도록 export
})
export class PrismaModule {}