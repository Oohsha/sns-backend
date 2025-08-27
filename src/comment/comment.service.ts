// src/comment/comment.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async findCommentsByPostId(postId: string) {
    await this.prisma.post.findUniqueOrThrow({ where: { id: postId } });
    return this.prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: { author: { select: { id: true, nickname: true } } },
    });
  }

  createComment(postId: string, authorId: string, content: string) {
    return this.prisma.comment.create({
      data: { content, postId, authorId },
      include: { author: { select: { id: true, nickname: true } } },
    });
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('댓글을 찾을 수 없습니다.');
    if (comment.authorId !== userId) throw new ForbiddenException('이 댓글을 삭제할 권한이 없습니다.');
    return this.prisma.comment.delete({ where: { id: commentId } });
  }
}