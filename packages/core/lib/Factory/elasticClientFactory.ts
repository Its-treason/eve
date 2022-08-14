import { Client } from '@elastic/elasticsearch';

export default function elasticClientFactory(): Client {
  if (
    !process.env.ELASTIC_HOST
  ) {
    throw new Error('Enviroment variable "ELASTIC_HOST" is not set!');
  }

  return new Client({
    node: process.env.ELASTIC_HOST,
    auth: {
      username: process.env.ELASTIC_USERNAME || '',
      password: process.env.ELASTIC_PASSWORD || '',
    },
  });
}
