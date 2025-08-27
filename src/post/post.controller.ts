// src/post/post.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards, UseInterceptors, UploadedFile, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import type { User } from '@prisma/client'; // 👈 import를 import type으로 변경
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('image'))
  createPost(@Body() createPostDto: CreatePostDto, @GetUser() user: User, @UploadedFile() file: Express.Multer.File) {
    return this.postService.createPost(user.id, createPostDto.content, file);
  }

  @Get('feed')
  @UseGuards(AuthGuard())
  getFeed(@GetUser() user: User, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number) {
    return this.postService.getFeed(user.id, page, limit);
  }
  
  // ... (다른 엔드포인트들은 이미 올바르게 수정되어 있으므로 생략, 전체 코드에는 포함됩니다)
}