// src/comment/comment.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import type { User } from '@prisma/client';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller() // 컨트롤러의 기본 경로를 비워둡니다.
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 특정 게시글의 댓글 목록 조회 (GET /posts/:postId/comments)
  @Get('posts/:postId/comments')
  findCommentsByPostId(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentService.findCommentsByPostId(postId);
  }

  // 댓글 생성 (POST /posts/:postId/comments)
  @Post('posts/:postId/comments')
  @UseGuards(AuthGuard()) // 로그인 필수
  createComment(
    @Param('postId', ParseIntPipe) postId: number,
    @GetUser() user: User,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.createComment(
      postId,
      user.id,
      createCommentDto.content,
    );
  }

  // 댓글 삭제 (DELETE /comments/:commentId)
  @Delete('comments/:commentId')
  @UseGuards(AuthGuard()) // 로그인 필수
  deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @GetUser() user: User,
  ) {
    return this.commentService.deleteComment(commentId, user.id);
  }
}