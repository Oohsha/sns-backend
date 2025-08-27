// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { PostModule } from './post/post.module';
import { ProfileModule } from './profile/profile.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    PostModule,
    ProfileModule,
    CloudinaryModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}