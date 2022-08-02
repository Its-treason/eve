## Development

Start the storage:

```
docker-compose -f docker-compose.development up -d
```

Start the Services:

```
docker-compose -f docker-compose.development.yml exec eve-cli yarn run api:dev
```

