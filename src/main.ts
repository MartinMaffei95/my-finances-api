import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
    
  );
  
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  console.log("Server is alive. Listening on port: "+port)
  await app.listen(port, '0.0.0.0');

}
bootstrap();
