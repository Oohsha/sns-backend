// src/post/post.module.ts
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PassportModule } from '@nestjs/passport';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CloudinaryModule, // 👈 2. imports 배열에 추가
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}