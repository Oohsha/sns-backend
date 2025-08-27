// src/post/dto/create-post.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}