# Le Jardinier (typescript)

This is simple simple discord bot made in typescript with discord.js.

### Installation

First, you'll need to download/clone this repository from github. Then run `npm install` in the project directory.

### Configuration

In order to get the code working, you'll need to get:

-   a bot token ([learn more](https://discordjs.guide/preparations/setting-up-a-bot-application.html#your-token)).
-   a youtube API key ([learn more](https://www.embedplus.com/how-to-create-a-youtube-api-key.aspx))
-   a mongoDB database URI

Then add those in [secrets.example.ts](./src/config/secrets.example.ts) and then rename this file to `secrets.ts`.

Finally, don't forget to configure the bot prefix in [local.ts](./src/config/local.ts) (same method: editing [local.example.ts](./src/config/local.example.ts) and renaming it to `local.ts`)

### Starting

Finally, to start the code, run:

-   `npm start`: normal start
-   `npm run dev`: development start (with nodemon: restarting when code changes)

You can also use `npm run lint` to lint the code in `src/`:

### Dockerfile

To build the docker image you need to have docker installed.

Run `docker build -t [tag of your choice] -f ./Dockerfile .` to build the image.

_Note: For the docker build to success, you need to first follow the instructions in the Configuration section._

### Notes

-   You need to have nodejs, npm and npx installed on your computer (npm and npx are usually automatically installed with nodejs)
-   If you find a bug or have a suggestion, please create an issue so I can take a look at it.
-   [typescript.ts](./typescript.ts) is useless, I added it because my code editor put an error and adding this file was the way to fix it...
-   _Don't mind my code it can be fucked up sometimes..._

### References

-   [website](https://valflrt.github.io/lejardinier-typescript/) (github pages)
