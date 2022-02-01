import {
  Client,
  ClientEvents,
  GuildMember,
  Interaction,
  Message,
} from "discord.js";

import Context from "./context";

import database, { connectDatabase } from "../features/database";

import handlers from "./handlers";
import log from "./log";

import config from "../config";

interface IListenerCollectionOptions {
  type?: "on" | "once";
}

interface IMapObject {
  listener: (...args: ClientEvents[keyof ClientEvents]) => Promise<void>;
  options: IListenerCollectionOptions;
}

class ListenerCollection {
  private map = new Map<keyof ClientEvents, IMapObject>();

  public set<K extends keyof ClientEvents>(
    event: K,
    listener: (...args: ClientEvents[K]) => Promise<void>,
    options: IListenerCollectionOptions = {}
  ) {
    this.map.set(event, {
      listener: listener as (
        ...args: ClientEvents[keyof ClientEvents]
      ) => Promise<void>,
      options,
    });
  }

  public apply(client: Client) {
    this.map.forEach((v, k) => {
      switch (v.options.type) {
        case "on":
          client.on(k, v.listener);
          break;
        case "once":
          client.once(k, v.listener);
          break;
        default:
          client.on(k, v.listener);
          break;
      }
    });
  }
}

const listeners = new ListenerCollection();

/**
 * Listener for event "messageCreate"
 */
listeners.set("messageCreate", async (message: Message) => {
  if (message.author.bot) return; // skips if the author is a bot
  if (!message.author || !message.guild) return; // skips if guild or author are undefined

  await handlers.databaseUpdate(message);

  if (!message.content.startsWith(config.prefix)) return;

  let context = new Context(message);
  log.message.message(message, context); // logs every command

  if (context.hasCommand === true) {
    context.execute();
  } else if (context.hasPrefix) {
    context.message.react("❔");
  }
});

/**
 * Listener for event "interactionCreate"
 */
listeners.set("interactionCreate", async (i: Interaction) => {
  if (i.isButton() && i.guildId && i.customId === "autorole")
    handlers.autoroleHandler(i);
});

/**
 * Listener for event "guildMemberAdd"
 */
listeners.set("guildMemberAdd", async (member: GuildMember) => {
  let doc = {
    userId: member.id,
    guildId: member.guild.id,
  };
  database.members.updateOrCreateOne(doc, doc, doc);
  /**
   * that came right to mind
   * - doc ! doc ! doc !
   * - who's that ?
   * - it's a document ehe
   */
});

export default listeners;
