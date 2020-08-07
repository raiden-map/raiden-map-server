import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs'

async function bootstrap() {
  const httpsOptions = {//remove if in localhost
    key: fs.readFileSync('../cert/private.pem'),
    cert: fs.readFileSync('../cert/public.pem'),
  };
  const app = await NestFactory.create(AppModule, {httpsOptions});
  app.enableCors();
  app.setGlobalPrefix('api')
  await app.listen(3000);
}
bootstrap();
