import { Client } from "@elastic/elasticsearch";
import { container, instanceCachingFactory } from "tsyringe";
import elasticClientFactory from "./Factory/elasticClientFactory";
import mySqlClientFactory from "./Factory/mySqlClientFactory";
import MySQLClient from "./MySQLClient";

container.register(MySQLClient, { useFactory: instanceCachingFactory(mySqlClientFactory) });
container.register(Client, { useFactory: instanceCachingFactory(elasticClientFactory) })
