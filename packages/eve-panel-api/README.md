# EVE: API

Api for the EVE's React frontend. Not meant for external use.

## Setup

> Make sure to Set up the EVE: Storage first as its provides the DB-Container

Copy the `.env.example` to `.env` and replace all values accordingly.

Start the Project using Docker

````
docker-compose -f docker-compose.developemnt.yml up
````

By default, the API uses **Port 3030**. You can change this value in the docker-compose file.

## Tests

The API uses Jest for tests. Some tests need a MySQL-Server therefore tests must be run inside the Docker-Container.

````
docker-compose -f .\docker-compose.development.yml run node npm run test
````

Or alternatively in watch mode:

````
docker-compose -f .\docker-compose.development.yml run node npm run test:watch
````
