import { Client } from '@elastic/elasticsearch';

let client: Client;

export default function getElasticClient(): Client {
  if (client !== undefined) {
    return client;
  }

  client = new Client({
    node: process.env.ELASTIC_HOST,
    auth: {
      username: process.env.ELASTIC_USERNAME || '',
      password: process.env.ELASTIC_PASSWORD || '',
    },
  });  return client
}
