import getElasticClient from "../structures/getElasticClient";
import { Client } from "@elastic/elasticsearch";
import { readFileSync } from "fs";

export default async function initEs(): Promise<void> {
  const client = getElasticClient();

  await createLogsIndex(client)
}

async function createLogsIndex(client: Client): Promise<void> {
  const index = `eve-logs-${process.env.NODE_ENV}`;

  const templateExists = await client.indices.existsIndexTemplate({ name: index });
  if (templateExists) {
    console.log(`Deleting old index Template: "${index}"`);
    await client.indices.deleteIndexTemplate({ name: index });
  }

  console.log(`Creating index Template: "${index}"`);
  const indexTemplate = JSON.parse(readFileSync('./data/elastic_index_templates/logs.json').toString());

  await client.indices.putIndexTemplate({
    name: index,
    body: indexTemplate
  });
}
