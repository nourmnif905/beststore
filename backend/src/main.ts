import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Autoriser toutes les origines (ou adapte l'URL si besoin)
  app.enableCors({
    origin: 'http://localhost:8100', // ou '*' pour tout autoriser
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3111);
}

bootstrap();
