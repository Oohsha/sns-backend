// src/types/express.d.ts

import { User } from '@prisma/client'; // Prisma가 생성한 User 타입을 가져옵니다.

// 기존 Express의 Request 타입 정의를 확장합니다.
declare module 'express' {
  export interface Request {
    // Request 객체에 user 속성이 존재할 수 있으며, 그 타입은 Prisma의 User 모델과 같다고 알려줍니다.
    // 단, password는 제외된 타입이어야 하므로 Omit을 사용합니다.
    user?: Omit<User, 'password'>;
  }
}