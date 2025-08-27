// src/comment/comment.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  // 특정 게시글의 모든 댓글 조회
  async findCommentsByPostId(postId: number) {
    // 게시글 존재 여부 확인
    await this.prisma.post.findUniqueOrThrow({ where: { id: postId } });

    return this.prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' }, // 오래된 댓글부터 (정순)
      include: {
        author: {
          select: { id: true, nickname: true },
        },
      },
    });
  }

  // 댓글 생성
  createComment(postId: number, authorId: number, content: string) {
    return this.prisma.comment.create({
      data: {
        content,
        postId,
        authorId,
      },
      include: { // 프론트엔드 편의를 위해 생성 직후 author 정보 포함
        author: {
          select: { id: true, nickname: true },
        },
      },
    });
  }

  // 댓글 삭제
  async deleteComment(commentId: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }
    if (comment.authorId !== userId) {
      throw new ForbiddenException('이 댓글을 삭제할 권한이 없습니다.');
    }

    return this.prisma.comment.delete({
      where: { id: commentId },
    });
  }
}