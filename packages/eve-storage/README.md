# EVE: Storage

Storage project containing configuration and SQL- & Elastic-Templates for setting up EVE. 

## ENV-Variables
List of all ENV-Variables used in the projects and how to get the correct values

- `NODE_ENV`: `development`/`production`, detainment's the environment.
- `DISCORD_TOKEN`: Discord-Bot token. Goto [discord.dev](https://discord.dev) and create an Application to obtain one.
- `DB_HOST`: Hostname of the MariaDB server. Default is `mariadb`
- `DB_USER`: Username for the MariaDB server. Default is `root`
- `DB_PASSWORD`: Password for MariaDB server. Default is `mht749032qtGr87943gfnhdjG5545gf`
- `DB_DATABASE`: The MariaDB Database to use. Default is `eve-dev`. Make sure to initialise the database with the script.
- `CLIENT_ID`: The UserId of your Bot.
- `GUILD_ID`: ID of the Guild/Server you want to deploy SlashCommands. Only needed for development.
- `CORS_DOMAIN`: Used in the Eve-Panel-Api, should be the domain of the Api or `*` for development.
- `CLIENT_ID`: Client ID found in OAuth2 Page of your bot application. Used in the Eve-Panel-Api for the login.
- `CLIENT_SECRET`: Client Secret found in OAuth2 Page of your bot application. Used in the Eve-Panel-Api for the Login.
- `REDIRECT_URI`: Must be added in the OAuth2 Page of your bot application. For development use: `http://localhost:3000/doLogin`.
- `AUTH_URL`: Url to start the OAuth2 login process. Goto OAuth2 Page of your bot application and in the "OAuth2 URL Generator" select scope "identify", the generated Url is the `AUTH_URL`.
- `SPOTIFY_CLIENT_ID`: Client ID of the Spotify-Application. Create an Application [here](https://developer.spotify.com/dashboard/applications) and copy the ID from the overview
- `SPOTIFY_CLIENT_SECRET`: Client Secret of the Spotify-Application. Create an Application [here](https://developer.spotify.com/dashboard/applications) and copy the Secret from the overview
- `ELASTIC_HOST`: Hostname of the ElasticSearch. Default is `http://elasticsearch:9200`.

> All projects have a ".env.example" file with default values. Copy this file to ".env" and fill out missing values

> Make sure to change passwords for production. Also make sure to not expose the MariaDB & ElasticSearch ports to the public
