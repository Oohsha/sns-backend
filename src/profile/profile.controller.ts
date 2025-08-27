// src/profile/profile.controller.ts

import { Controller, Delete, Get, Param, Post, UseGuards, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import type { User } from '@prisma/client';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':nickname')
  @UseGuards(OptionalAuthGuard) // 👈 적용!
  getProfile(@Param('nickname') nickname: string, @Req() req) {
    // req.user는 있거나(로그인) 없거나(비로그인) 할 수 있습니다.
    const currentUserId = req.user?.id;
    return this.profileService.getProfile(nickname, currentUserId);
  }

  // ... (기존 follow/unfollow 엔드포인트는 AuthGuard()를 그대로 사용합니다)
  @Post(':nickname/follow')
  @UseGuards(AuthGuard()) // 👈 여기는 로그인이 필수이므로 AuthGuard()
  followUser(@GetUser() user: User, @Param('nickname') nickname: string) {
    return this.profileService.followUser(user.id, nickname);
  }

  @Delete(':nickname/follow')
  @UseGuards(AuthGuard()) // 👈 여기도 로그인이 필수이므로 AuthGuard()
  unfollowUser(@GetUser() user: User, @Param('nickname') nickname: string) {
    return this.profileService.unfollowUser(user.id, nickname);
  }
}