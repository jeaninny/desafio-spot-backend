import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Desafio SPOT Metrics')
    .setDescription('Desafio realizado como 2ª fase do processo seletivo para estágio backend')
    .setContact('Jeaninny Teixeira', 'https://linktr.ee/jeaninnyteixeira', 'jeaninny.teixeira@gmail.com')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/swagger', app, document)

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();