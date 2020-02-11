import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { Logger } from '@nestjs/common';

const serverConfig = config.get('server')

async function bootstrap() {
  const logger = new Logger('App')
  const app = await NestFactory.create(AppModule)
  const port = process.env.PORT || serverConfig.port
  app.enableCors()

  logger.log(`App running on port : ${port}`)
  await app.listen(port)
}
bootstrap();
