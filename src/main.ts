import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { GqlHttpExceptionFilter } from './filters/gqlFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors) => {
        const formattedErrors = Object.values(errors[0].constraints).join(', ');
        return new UnprocessableEntityException(formattedErrors);
      },
    }),
  );
  app.useGlobalFilters(new GqlHttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
