// src/auth/decorator/get-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

// createParamDecorator를 사용하여 사용자 정의 데코레이터인 GetUser를 만듭니다.
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    // ExecutionContext로부터 request 객체를 추출합니다.
    const request = ctx.switchToHttp().getRequest();
    // request 객체에서 user 정보를 반환합니다.
    // AuthGuard가 이 정보를 자동으로 채워줍니다.
    return request.user;
  },
);