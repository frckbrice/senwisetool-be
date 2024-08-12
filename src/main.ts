import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // app.useGlobalGuards(new AuthGuard());
  // app.setGlobalPrefix("api");
  const config = new DocumentBuilder()
    .addBearerAuth()  // bearer auth enabled
    .setTitle('senwisetool api')
    .setDescription('The senwisetool API documentation')
    .setVersion('1.0')
    .addTag("senwisetool-api")
    .build();

  // override operationIdFactory to make it unique per method
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'swagger/json',
    // useGlobalPrefix: true,
    yamlDocumentUrl: 'swagger/yaml',
  });

  await app.listen(5000);
}
bootstrap();