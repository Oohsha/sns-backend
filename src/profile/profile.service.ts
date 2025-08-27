// src/profile/profile.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async findProfileByNickname(nickname: string) {
    const user = await this.prisma.user.findUnique({ where: { nickname } });
    if (!user) throw new NotFoundException(`${nickname} 사용자를 찾을 수 없습니다.`);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getProfile(nickname: string, currentUserId?: string) {
    const profileUser = await this.prisma.user.findUnique({
      where: { nickname },
      select: {
        id: true, nickname: true, bio: true, profileImageUrl: true,
        _count: { select: { followers: true, following: true } },
        posts: {
          select: { id: true, content: true, imageUrl: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!profileUser) throw new NotFoundException(`${nickname} 사용자를 찾을 수 없습니다.`);
    let isFollowing = false;
    if (currentUserId && currentUserId !== profileUser.id) {
      const followRelation = await this.prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: currentUserId, followingId: profileUser.id } },
      });
      isFollowing = !!followRelation;
    }
    return { ...profileUser, isFollowing };
  }

  async followUser(followerId: string, followingNickname: string) {
    const following = await this.findProfileByNickname(followingNickname);
    const followingId = following.id;
    if (followerId === followingId) throw new Error('자기 자신을 팔로우할 수 없습니다.');
    const existingFollow = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });
    if (existingFollow) return { message: '이미 팔로우하고 있습니다.' };
    await this.prisma.follow.create({ data: { followerId, followingId } });
    return { message: `${followingNickname}님을 팔로우했습니다.` };
  }

  async unfollowUser(followerId: string, followingNickname: string) {
    const following = await this.findProfileByNickname(followingNickname);
    const followingId = following.id;
    const existingFollow = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });
    if (!existingFollow) throw new NotFoundException('팔로우 관계가 존재하지 않습니다.');
    await this.prisma.follow.delete({
      where: { followerId_followingId: { followerId, followingId } },
    });
    return { message: `${followingNickname}님을 언팔로우했습니다.` };
  }
}