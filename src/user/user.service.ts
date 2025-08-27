// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: number) {
    // id로 유저를 찾되, 비밀번호는 제외하고 가져온다.
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nickname: true,
        profileImageUrl: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
  }
  async findAllUsers() {
    return this.prisma.user.findMany({
      select: { // 비밀번호 등 민감 정보는 제외
        id: true,
        nickname: true,
        profileImageUrl: true, // 나중에 프로필 이미지도 보여주기 위해
      },
      orderBy: {
        createdAt: 'desc', // 최근 가입자 순
      },
    });
  }
}