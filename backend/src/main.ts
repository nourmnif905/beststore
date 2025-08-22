import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS (e.g., for Ionic or frontend access)
  app.enableCors({
    origin: 'http://localhost:8100', // frontend origin (e.g., Ionic app)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Start the server on port 3111
  await app.listen(3000);
  console.log(`🚀 Server running on http://localhost:3000`);
}

bootstrap();
