// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: string) { // number -> string
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, email: true, nickname: true,
        profileImageUrl: true, bio: true,
        createdAt: true, updatedAt: true,
      },
    });
  }

  async findAllUsers() {
    return this.prisma.user.findMany({
      select: { id: true, nickname: true, profileImageUrl: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}