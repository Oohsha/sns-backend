// src/cloudinary/cloudinary.service.ts
import { Injectable } from '@nestjs/common';
// v2 as cloudinary 옆에 UploadApiResponse를 import 합니다.
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
// CloudinaryResponse import는 삭제합니다.
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  // Promise의 반환 타입을 UploadApiResponse로 변경합니다.
  uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    // Promise의 제네릭 타입도 UploadApiResponse로 변경합니다.
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          // result의 타입은 이제 자연스럽게 추론됩니다.
          if (error) return reject(error);
          
          // result가 undefined인 경우를 대비한 방어 코드
          if (!result) {
              return reject(new Error('Cloudinary upload returned no result.'));
          }
          
          // 타입이 일치하므로 타입 단언(as) 없이 바로 resolve할 수 있습니다.
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}