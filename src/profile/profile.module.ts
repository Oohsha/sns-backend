// src/profile/profile.module.ts
import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PassportModule } from '@nestjs/passport'; // 추가

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })], // 추가
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}