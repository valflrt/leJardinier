import { Message, MessageEmbed } from "discord.js";
import { codeBlock } from "@discordjs/builders";

import Command from "../features/commands/command";
import MessageParser from "../features/commands/messageParser";

import logger from "../features/logger";
import logPresets from "./logPresets";

import commandList from "../commands";
import config from "../config";
import reactions from "../assets/reactions";
import lejardinier from "..";
import MessageActions from "./actions";

class Context {
  public message: Message;
  public actions: MessageActions;

  public attributes: MessageParser;

  public command: Command | null;

  constructor(message: Message) {
    this.message = message;
    this.attributes = new MessageParser(this.message.content);
    this.command = commandList.find(this.attributes.detectedNamespace);
    this.actions = new MessageActions(this, message);
  }

  /**
   * Returns a true or false whether a command has been found or not
   */
  get hasCommand(): boolean {
    return this.command ? true : false;
  }

  /**
   * Returns a boolean whether the message content starts with the prefix or not
   */
  get hasPrefix(): boolean {
    return this.message.content.startsWith(config.prefix);
  }

  /**
   * Returns a new preformatted MessageEmbed
   */
  get embed(): MessageEmbed {
    return new MessageEmbed()
      .setAuthor({
        name: lejardinier.client.user!.username,
        iconURL:
          "https://media.discordapp.net/attachments/749765499998437489/823241819801780254/36fb6d778b4d4a108ddcdefb964b3cc0.webp",
      })
      .setFooter(this.command ? { text: this.command.namespace } : null)
      .setColor("#49a013")
      .setTimestamp();
  }

  /**
   * Executes the current command and returns a Promise
   */
  public async execute(): Promise<void> {
    if (!this.command) return logger.log(`Command does not exist`, "error");

    await this.message.channel.sendTyping();

    try {
      await this.command!.execution(this);
      logPresets.COMMAND_EXECUTION_SUCCESS(this.command!);
    } catch (e) {
      logPresets.COMMAND_EXECUTION_FAILURE(this.command!, e);
      this.actions.sendCustomEmbed((embed) =>
        embed
          .setDescription(
            `${reactions.error.random} An error occurred while executing this command:\n`.concat(
              codeBlock(`${e}`)
            )
          )
          .setColor("RED")
      );
      throw e;
    }
  }
}

export default Context;
