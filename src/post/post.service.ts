// src/post/post.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async createPost(userId: number, content: string, file?: Express.Multer.File) {
    let imageUrl: string | null = null;
    if (file) {
      const cloudinaryResponse = await this.cloudinary.uploadFile(file);
      imageUrl = cloudinaryResponse.secure_url;
    }
    return this.prisma.post.create({
      data: { content, authorId: userId, imageUrl: imageUrl },
      include: { author: { select: { id: true, nickname: true } } },
    });
  }

  // 👇 findAllPosts 메서드 수정됨
  findAllPosts(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return this.prisma.post.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { id: true, nickname: true } } },
    });
  }

  async findPostById(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { author: { select: { id: true, nickname: true } } },
    });
    if (!post) {
      throw new NotFoundException(`${id}번 게시글을 찾을 수 없습니다.`);
    }
    return post;
  }
  
  // 👇 getFeed 메서드 수정됨
  async getFeed(userId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const followingUsers = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followingIds = followingUsers.map((follow) => follow.followingId);
    const feedUserIds = [userId, ...followingIds];
    return this.prisma.post.findMany({
      where: { authorId: { in: feedUserIds } },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { id: true, nickname: true } } },
    });
  }

  async updatePost(postId: number, userId: number, newContent: string) {
    const post = await this.findPostById(postId);
    if (post.authorId !== userId) {
      throw new ForbiddenException('이 게시글을 수정할 권한이 없습니다.');
    }
    return this.prisma.post.update({
      where: { id: postId },
      data: { content: newContent },
      include: { author: { select: { id: true, nickname: true } } },
    });
  }

  async deletePost(postId: number, userId: number) {
    const post = await this.findPostById(postId);
    if (post.authorId !== userId) {
      throw new ForbiddenException('이 게시글을 삭제할 권한이 없습니다.');
    }
    return this.prisma.post.delete({ where: { id: postId } });
  }

  async likePost(postId: number, userId: number) {
    await this.findPostById(postId);
    const existingLike = await this.prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    if (existingLike) {
      return { message: '이미 좋아요를 눌렀습니다.' };
    }
    await this.prisma.like.create({ data: { userId, postId } });
    return { message: `${postId}번 게시글에 좋아요를 눌렀습니다.` };
  }

  async unlikePost(postId: number, userId: number) {
    await this.findPostById(postId);
    const existingLike = await this.prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    if (!existingLike) {
      throw new NotFoundException('좋아요 관계가 존재하지 않습니다.');
    }
    await this.prisma.like.delete({
      where: { userId_postId: { userId, postId } },
    });
    return { message: `${postId}번 게시글의 좋아요를 취소했습니다.` };
  }
}