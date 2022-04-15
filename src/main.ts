import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './adapters/socket-redis.adapter'
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './middlewares/exception-filter';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(new RedisIoAdapter(app))

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(process.env.PORT, () => {
    console.log(`app is running on: http://localhost:${process.env.PORT}`)
  });
}
bootstrap();
