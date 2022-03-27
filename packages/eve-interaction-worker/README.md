# EVE: Interaction Worker

Worker that listens to the Interaction Created Event. Handles all SlashCommands and ButtonInteractions.
This Project uses `tsyringe` for Dependency Injection

## Setup

Set up the Storage first.

Copy the `.env.example` to `.env` and change all values accordingly.

Build the Docker-Container:
````
docker-compose -f docker-compose.development build
````

And then start it:
````
docker-compose -f docker-compose.development up
````
