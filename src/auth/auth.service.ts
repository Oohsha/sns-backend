// src/auth/auth.service.ts
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    console.log('--- [디버그] 회원가입 시작 ---');
    const { email, password, nickname } = signUpDto;
    console.log('입력받은 데이터:', { email, nickname });

    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { nickname }] },
    });

    if (existingUser) {
      console.log('중복된 사용자 발견:', existingUser);
      throw new ConflictException('이미 사용 중인 이메일 또는 닉네임입니다.');
    }
    console.log('사용자 중복 없음. 다음 단계로 진행.');

    // 2. 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('비밀번호 암호화 완료.');

    // 3. 사용자 생성
    console.log('데이터베이스에 사용자 생성을 시도합니다...');
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          nickname,
        },
      });
      console.log('사용자 생성 성공! 생성된 유저 ID:', user.id);
      
      // ... (비밀번호 제거 및 반환 로직)
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;

    } catch (error) {
      console.error('!!! 데이터베이스 저장 중 에러 발생 !!!', error);
      throw error; // 에러를 다시 던져서 NestJS가 처리하도록 함
    }
  }
  // 👇 로그인 메서드 추가
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. 이메일로 사용자 확인
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호를 확인해주세요.');
    }

    // 2. 비밀번호 비교
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('이메일 또는 비밀번호를 확인해주세요.');
    }

    // 3. JWT 페이로드(Payload) 생성 (토큰에 담을 정보)
    const payload = { sub: user.id, email: user.email };

    // 4. JWT 생성 및 반환
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}