// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS 설정: Vercel 서브도메인 및 지정 도메인 허용
  app.enableCors({
    origin: (origin, callback) => {
      const allowList = [
        'http://localhost:3000',
        'https://sns-frontend-azure.vercel.app',
      ];
      const vercelRegex = /^https:\/\/.*\.vercel\.app$/;

      if (!origin || allowList.includes(origin) || vercelRegex.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0'); // Railway에서는 0.0.0.0으로 바인딩
}
bootstrap();