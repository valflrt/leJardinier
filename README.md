# Le Jardinier

![workflow "push" status](https://github.com/valflrt/lejardinier/actions/workflows/push.yml/badge.svg)

Le Jardinier is simple simple discord bot made with typescript and using discord.js.

## Installation

First, you'll need to download/clone this repository from github. Then run `npm install` in the project directory.

## Configuration

In order to get the code working, you'll need to get:

-   a bot token ([learn more](https://discordjs.guide/preparations/setting-up-a-bot-application.html#your-token)).
-   a youtube API key ([learn more](https://www.embedplus.com/how-to-create-a-youtube-api-key.aspx))
-   a mongoDB database URI

Next, add those in [`secrets.example.ts`](./src/config/secrets.example.ts) and then rename this file to `secrets.ts`.

You also need to set the bot prefix in `local.ts` (same method: editing [`local.example.ts`](./src/config/local.example.ts) and renaming it to `local.ts`)

## Starting

Finally, to start the code, you can choose to run one of the commands below:

-   `npm start`: for normal start
-   `npm run dev`: for development start (with nodemon: restarting when code changes)

You can also use `npm run lint` to lint the code in `src/`:

## Docker

To build the docker image you need to have docker installed.

Run `docker build -t [tag of your choice] -f ./Dockerfile .` to build the image.

Notes:
- You may need to run this command as admninistrator.
- For the docker build to success, you need to first follow the instructions in the Configuration section.

## Notes

-   You need to have nodejs, npm and npx installed on your computer (npm and npx are usually automatically installed with nodejs)
-   If you find a bug or have a suggestion, please create an issue so I can take a look at it.
-   [`typescript.ts`](./typescript.ts) is useless, I added it because my code editor put an error and adding this file was the way to fix it...
-   _Don't mind my code it can be fucked up sometimes..._

## More Information

-   [leJardinier website](https://valflrt.github.io/lejardinier/) (github pages)
