import 'source-map-support/register';
import express, { json, NextFunction, Request, Response } from 'express';
import http from 'http';
import getConnection from './structures/getConnection';
import corsMiddleware from './web/middleware/corsMiddleware';
import routerV1 from './web/RouterV1';
import getLogger from './structures/getLogger';
import getApiClient from './structures/getApiClient';
import helmet from 'helmet';

(async () => {
  // Init the client and connection
  await getConnection();
  const logger = getLogger();
  await getApiClient();

  const app = express();
  const server = http.createServer(app);

  app.use(helmet(), corsMiddleware, json({ limit: '50MB' }), (req: Request, res: Response, next: NextFunction) => {
    next();
    logger.info('Api request', {
      path: req.path,
      method: req.method,
      ip: req.ip,
      protocol: req.protocol,
    });
  });
  app.use('/v1/', routerV1);

  server.listen(3030, () => {
    logger.info('Started eve-panel-api');
  });
})();
