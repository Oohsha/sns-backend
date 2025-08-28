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

  // 공개 피드(로그인 없이) 목록 - 페이지네이션
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.postService.findAllPosts(page, limit);
  }

  @Get('feed')
  @UseGuards(AuthGuard())
  getFeed(@GetUser() user: User, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number) {
    return this.postService.getFeed(user.id, page, limit);
  }
  
  // 게시글 상세 조회
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findPostById(id);
  }

  // 게시글 수정
  @Patch(':id')
  @UseGuards(AuthGuard())
  update(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePost(id, user.id, updatePostDto.content);
  }

  // 게시글 삭제
  @Delete(':id')
  @UseGuards(AuthGuard())
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.postService.deletePost(id, user.id);
  }
}