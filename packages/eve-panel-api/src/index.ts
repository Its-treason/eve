import 'source-map-support/register';
import express, { json, NextFunction, Request, Response } from 'express';
import http from 'http';
import getConnection from './structures/getConnection';
import corsMiddleware from './web/middleware/corsMiddleware';
import routerV1 from './web/RouterV1';
import getLogger from './structures/getLogger';
import getApiClient from './structures/getApiClient';
import helmet from 'helmet';
import loggerMiddleware from "./web/middleware/loggerMiddleware";

(async () => {
  // Init the client and connection
  await getConnection();
  const logger = getLogger();
  await getApiClient();

  const app = express();
  const server = http.createServer(app);

  app.use(helmet());
  app.use(loggerMiddleware);
  app.use(corsMiddleware);
  app.use(json({ limit: '50MB' }));
  app.use('/v1/', routerV1);

  server.listen(3030, () => {
    logger.info('Started eve-panel-api');
  });
})();
