# EVE - A Discord Bot

## Setup - Development

Prerequisites:
- Docker & Docker-Compose

Copy the `.env.example` to `.env`. Some values are already prefilled and will
work with the `docker-compose.development.yml` other need to be set manually.
Important: When the environment variables are changed the eve-cli container must
be restart for the changes to take effect.

<details>
<summary>Infos for all environment variables</summary>
- `DISCORD_TOKEN`: Discord-Bot token. Goto [discord.dev](https://discord.dev) and create an Application to obtain one.
- `CLIENT_ID`: User Id of the discord bot account.
- `DB_HOST`: Hostname of the MariaDB server.
- `DB_USER`: Username for the MariaDB server.
- `DB_PASSWORD`: Password for MariaDB server.
- `DB_DATABASE`: The MariaDB Database to use.
- `ELASTIC_HOST`: Hostname of the ElasticSearch. Default is `http://elasticsearch:9200`.
- `ELASTIC_USERNAME`: Username for Elasticsearch, if it has one.
- `ELASTIC_PASSWORD`: Password for Elasticsearch, if it has one.
- `REDIS_URL`: Hostname of the Redis server.
- `NEXT_PUBLIC_API_HOST`: Url to Eve's for the frontend of the panel. Must be publicly accessible.
- `NEXT_PUBLIC_AUTH_URL`: Url to start the OAuth2 login process. Goto OAuth2 Page of your bot application and in the "OAuth2 URL Generator" select scopes "identify" & "guilds"
- `INTERNAL_API_HOST`: Url to Eve's Api for the backend of panel. Can be the Api's docker container name. 
- `CORS_DOMAIN`: Used in the Eve-Panel-Api, should be the domain of the Api or `*` for development.
- `CLIENT_SECRET`: Client Secret found in OAuth2 Page of your bot application.
- `REDIRECT_URI`: Must be added in the OAuth2 Page of your bot application. For development use: `http://localhost:3000/doLogin`.
- `SPOTIFY_CLIENT_ID`: Client ID of the Spotify-Application. You can create an app here: https://developer.spotify.com/dashboard/applications
- `SPOTIFY_CLIENT_SECRET`: Client Secret of the Spotify-Application.
- `GUILD_ID`: Id of the Guild/Server you want to deploy SlashCommands. Only needed for development.
</details>

Start by cloning the repository. Then you can start the database and node.js
container using:
```
docker-compose -f docker-compose.development up -d
```

Wait until the everything is up and running. Then you can start Eve's services.
Eve is split into multiple services, all of them have to be started
independently using:
```
docker-compose -f docker-compose.development.yml exec eve-cli nx run <service>
```
> You should create an alias to make starting services more convenient. For
> example: `alias dcd="docker compose -f docker-compose.development.yml"` works
> great for me.

Eve's Services are:

| Name | Command | Info |
| ---- | ------- | ---- |
| Bot  | bot:dev | Starting the bot will automatically setup the database |
| Api  | api:dev | Api will start on port 3030 |
| Panel | panel:server | The panel will start on port 3000 and depends on the api |

e.g. starting the bot: `docker-compose -f docker-compose.development.yml exec eve-cli nx run bot:dev`

## Setup - Production

Prerequisites:
- Docker & Docker-Compose

Copy the `.env` to `.env.example` and change all values accordingly. This is
explained in depth in the `Setup - Development` above.

The production image includes all of Eve's services. You only need to provide
an argument with the service to start.
Valid arguments are: `bot`, `api` & `panel`.

Example docker-compose.yml to start the bot:
```yml
  eve-bot:
    image: itstreason/eve:latest
    // This defines which service to start
    command: ["bot"]
    env_file: ".env"
```
