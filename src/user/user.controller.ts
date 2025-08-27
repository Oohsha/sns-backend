import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express'; // <-- 'type' 키워드 추가!
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get() // GET /user
  findAllUsers() {
    return this.userService.findAllUsers();
  }
  @Get('me') // GET /user/me
  @UseGuards(AuthGuard()) // 
  getMe(@Req() req: Request) {
    // AuthGuard가 성공적으로 실행되면, req 객체 안에 user 정보가 담겨 있다.
    // 이 user는 JwtStrategy의 validate 메서드에서 반환한 값이다.
    return req.user;
  }
}