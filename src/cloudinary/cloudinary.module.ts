// src/cloudinary/cloudinary.module.ts
import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary SDK 설정을 위한 상수
export const CLOUDINARY = 'Cloudinary';

@Module({
  providers: [
    CloudinaryService,
    {
      provide: CLOUDINARY,
      useFactory: () => {
        return cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });
      },
    },
  ],
  exports: [CloudinaryService], // 다른 모듈에서 사용할 수 있도록 export
})
export class CloudinaryModule {}