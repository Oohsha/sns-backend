// src/comment/comment.controller.ts
import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import type { User } from '@prisma/client'; // 👈 import를 import type으로 변경
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('posts/:postId/comments')
  findCommentsByPostId(@Param('postId') postId: string) {
    return this.commentService.findCommentsByPostId(postId);
  }

  @Post('posts/:postId/comments')
  @UseGuards(AuthGuard())
  createComment(@Param('postId') postId: string, @GetUser() user: User, @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.createComment(postId, user.id, createCommentDto.content);
  }

  @Delete('comments/:commentId')
  @UseGuards(AuthGuard())
  deleteComment(@Param('commentId') commentId: string, @GetUser() user: User) {
    return this.commentService.deleteComment(commentId, user.id);
  }
}