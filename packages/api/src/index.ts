import 'source-map-support/register';
import 'reflect-metadata';
import { Logger } from '@eve/core';
import './dependencyDefinition';
import * as express from 'express';
import { createServer } from 'http';
import helmet from 'helmet';
import { container } from 'tsyringe';
import UtilMiddlewares from './Web/Middleware/UtilMiddlewares';
import RouterV1 from './Web/RouterV1';
import registerErrorAndShutdownHandler from './Util/registerErrorAndShutdownHandler';

(async () => {
  // Init the client and connection
  const logger = container.resolve(Logger);
  const utilMiddlewares = container.resolve(UtilMiddlewares);
  const routerV1 = container.resolve(RouterV1);

  registerErrorAndShutdownHandler(logger);

  const app = express();
  const server = createServer(app);

  app.use(helmet());
  app.use(utilMiddlewares.corsMiddleware.bind(utilMiddlewares));
  app.use(utilMiddlewares.loggerMiddleware.bind(utilMiddlewares));
  app.use(express.json({ limit: '50MB' }));
  app.use('/v1/', routerV1.createRouter());

  server.listen(3030, () => {
    logger.info('Started eve-panel-api');
  });
})();
