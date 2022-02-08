import {
  Client,
  ClientEvents,
  GuildMember,
  Interaction,
  Message,
} from "discord.js";

import Context from "./context";

import handlers from "./handlers";

import { connectDatabase } from "../features/database";
import MemberModel from "../features/database/models/member";
import GuildModel from "../features/database/models/guild";

import logPresets from "./logPresets";

import config from "../config";

interface IListenerCollectionOptions {
  type?: "on" | "once";
}

interface ListenerCollectionMap {
  listener: (...args: ClientEvents[keyof ClientEvents]) => Promise<void>;
  options: IListenerCollectionOptions;
}

class ListenerCollection {
  private map = new Map<keyof ClientEvents, ListenerCollectionMap>();

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
  logPresets.MESSAGE_LOG(message, context); // logs every command

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
  let memberFromDB = await MemberModel.findOne({
    userId: member.id,
    guildId: member.guild.id,
  });
  if (!memberFromDB)
    memberFromDB = new MemberModel({
      userId: member.id,
      guildId: member.guild.id,
    });

  /**
   * that came right to mind
   * - doc ! doc ! doc !
   * - who's that ?
   * - it's a document ehe
   */
});

listeners.set("messageDelete", async (message) => {
  /**
   * Skips if the message doesn't contains a MessageActionRow that contains a MessageButton
   * with "autorole" as customId
   */
  if (
    !message.components.find((v) =>
      v.components.find((v) => v.customId === "autorole")
    )
  )
    return;

  let guildFromDB = await GuildModel.findOne({ id: message.guildId! });
  if (!guildFromDB) return;

  /**
   * removes the autorole object in the database
   */
  guildFromDB.autorole = guildFromDB.autorole.filter(
    (v) => v.channelId !== message.channelId && v.messageId !== message.id
  );
  await guildFromDB.save();
});

export const ready: (...args: ClientEvents["ready"]) => Promise<void> = async (
  client
) => {
  /**
   * Tries to connect to database
   */
  logPresets.DATABASE_CONNECTION_PENDING();
  try {
    await connectDatabase();
    logPresets.DATABASE_CONNECTION_SUCCESS();
  } catch (e) {
    throw logPresets.DATABASE_CONNECTION_FAILURE(e);
  }

  /**
   * Sets bot activity
   */
  client.user!.setActivity({
    name: `${config.prefix}help`,
    type: "WATCHING",
  });

  logPresets.BOT_CONNECTION_SUCCESS(client.user!.tag, client.user!.id);
};

export default listeners;
