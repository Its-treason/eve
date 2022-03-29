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

Install dependencies. `sange` will be compiled on the first install, to avoid installing 10 tons of
dependencies on your local system you should execute this inside the container
````
docker-compose -f docker-compose.development run node npm i
````

And then start it using:
````
docker-compose -f docker-compose.development up
````
