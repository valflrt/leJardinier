import LeJardinier from "./bot/bot";
import { botLogger } from "./bot/log";

botLogger.startupSequence();

const lejardinier = new LeJardinier({
  intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_PRESENCES",
    "GUILD_VOICE_STATES",
    "GUILD_EMOJIS_AND_STICKERS",
  ],
});

lejardinier.start();

export default lejardinier;
