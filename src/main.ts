import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './global/filter/http-exception.filter';
import 'reflect-metadata'; // is used to allow the usage of class transformers to be applied to remove password.

const PORT = process.env.PORT ?? 5000;
const dev_server_url = `${process.env.LOCAL_API_URL} `;
const production_server_url = `${process.env.PROD_API_URL} `;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // call the http adapter here
  const { httpAdapter } = app.get(HttpAdapterHost);
  // apply global filters for not handled exceptions
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // app.enableCors();
  // app.useGlobalGuards(new AuthGuard());
  app.setGlobalPrefix('v1');
  const config = new DocumentBuilder()
    .addBearerAuth() // bearer auth enabled
    .setTitle('senwisetool api')
    .setDescription('The senwisetool API documentation')
    .setVersion('1.0')
    .addTag('senwisetool-api')
    .build();

  // override operationIdFactory to make it unique per method
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'swagger/json',
    // useGlobalPrefix: true,
    yamlDocumentUrl: 'swagger/yaml',
  });

  const environment = process.env.NODE_ENV || 'development';
  await app.listen(PORT, () => {
    console.log(
      `Server running in ${environment} mode on  ${environment === 'production' ? production_server_url : dev_server_url}`,
    );
  });
}
bootstrap();
