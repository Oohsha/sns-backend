// src/post/post.controller.ts
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from './dto/create-post.dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import type { User } from '@prisma/client';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('image'))
  createPost(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.postService.createPost(
      user.id,
      createPostDto.content,
      file,
    );
  }

  // 👇 getFeed 엔드포인트 수정됨
  @Get('feed')
  @UseGuards(AuthGuard())
  getFeed(
    @GetUser() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.postService.getFeed(user.id, page, limit);
  }

  // 👇 findAllPosts 엔드포인트 수정됨
  @Get()
  findAllPosts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.postService.findAllPosts(page, limit);
  }

  @Get(':id')
  findPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findPostById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  updatePost(
    @Param('id', ParseIntPipe) postId: number,
    @GetUser() user: User,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePost(
      postId,
      user.id,
      updatePostDto.content,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  deletePost(@Param('id', ParseIntPipe) postId: number, @GetUser() user: User) {
    return this.postService.deletePost(postId, user.id);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard())
  likePost(@Param('id', ParseIntPipe) postId: number, @GetUser() user: User) {
    return this.postService.likePost(postId, user.id);
  }

  @Delete(':id/like')
  @UseGuards(AuthGuard())
  unlikePost(@Param('id', ParseIntPipe) postId: number, @GetUser() user: User) {
    return this.postService.unlikePost(postId, user.id);
  }
}