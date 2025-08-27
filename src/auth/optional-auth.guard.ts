// src/auth/optional-auth.guard.ts

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  // handleRequest 메서드를 오버라이드합니다.
  handleRequest(err, user, info, context) {
    // AuthGuard('jwt')는 토큰이 없거나 유효하지 않으면 err 또는 info에 에러 정보를,
    // user는 false 또는 undefined를 반환합니다.

    // 우리는 에러가 발생해도 던지지 않고, 그냥 user 정보만 반환합니다.
    // 토큰이 유효하면 user 객체가, 유효하지 않으면 false나 undefined가 반환되어
    // req.user에 담기게 됩니다.
    return user;
  }
}