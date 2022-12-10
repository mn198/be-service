import { RequestMethod, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import Helmet from 'helmet';
import * as RequestIP from 'request-ip';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { API_PREFIX } from './constants/app.constant';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix(API_PREFIX, {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  setupSwagger(app);

  const configService = app.get(ConfigService);

  app.use(Helmet());
  app.use(compression());
  app.use(RequestIP.mw());

  await app.listen(configService.get<number>('PORT'));
  app.enableShutdownHooks();
}
bootstrap();
