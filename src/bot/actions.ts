import {
  Message,
  MessageEditOptions,
  MessageEmbed,
  MessagePayload,
  ReplyMessageOptions,
} from "discord.js";

import Context from "./context";

export default class MessageActions {
  protected message: Message;
  protected context: Context;

  constructor(context: Context, message: Message) {
    this.message = message;
    this.context = context;
  }

  /**
   * Sends a message in the current channel
   * @param options messages options
   */
  public send = async (
    options: string | MessagePayload | ReplyMessageOptions
  ): Promise<SentMessageActions> => {
    return this.attachSentMessageActions(
      await this.message.channel.send(options)
    );
  };

  /**
   * Replies to a message with an embed
   * @param embed embed to send
   * @param options optional – message options
   */
  public sendEmbed = async (
    embed: MessageEmbed,
    options: ReplyMessageOptions = {}
  ): Promise<SentMessageActions> => {
    if (!options.embeds) options.embeds = [];
    options.embeds.push(embed);
    return this.attachSentMessageActions(await this.message.reply(options));
  };

  /**
   * Replies to a message with a text embed
   * @param content text to use in the embed
   * @param options optional – message options
   */
  public sendTextEmbed = async (
    content: string,
    options: ReplyMessageOptions = {}
  ): Promise<SentMessageActions> => {
    return await this.sendEmbed(this.returnTextEmbed(content), options);
  };

  /**
   * Returns a text embed
   * @param content text to send as the description of the MessageEmbed
   */
  public returnTextEmbed = (content: string): MessageEmbed => {
    return this.context.embed.setDescription(content);
  };

  /**
   * Replies to a message with a custom MessageEmbed
   * @param setup callback to set up the custom embed
   * @param options optional – message options
   */
  public sendCustomEmbed = async (
    setup: (embed: MessageEmbed) => MessageEmbed,
    options: ReplyMessageOptions = {}
  ): Promise<SentMessageActions> => {
    return await this.sendEmbed(this.returnCustomEmbed(setup), options);
  };

  /**
   * Returns a custom embed
   * @param setup callback to set up the custom embed
   */
  public returnCustomEmbed = (
    setup: (embed: MessageEmbed) => MessageEmbed
  ): MessageEmbed => {
    return setup(this.context.embed);
  };

  /**
   * Creates a new SentMessageActions object
   * @param message message which to attach to
   */
  protected attachSentMessageActions(message: Message) {
    return new SentMessageActions(this.context, message);
  }
}

export class SentMessageActions extends MessageActions {
  public message: Message;

  constructor(context: Context, message: Message) {
    super(context, message);
    this.message = message;
  }

  /**
   * Edits a sent message with an embed
   * @param embed embed to edit the message with
   * @param options optional – message edit options
   */
  public editWithEmbed = async (
    embed: MessageEmbed,
    options: MessageEditOptions = {}
  ): Promise<SentMessageActions> => {
    if (!options.embeds) options.embeds = [];
    options.embeds.push(embed);
    return this.attachSentMessageActions(await this.message.edit(options));
  };

  /**
   * Edits a sent message with a text embed
   * @param text Text to use in the embed
   * @param options optional – message edit options
   */
  public editWithTextEmbed(
    text: string,
    options: MessageEditOptions = {}
  ): Promise<SentMessageActions> {
    return this.editWithEmbed(this.returnTextEmbed(text), options);
  }

  /**
   * Edits a sent message with a custom embed
   * @param setup callback to set up the custom embed
   * @param options optional – message edit options
   */
  public editWithCustomEmbed(
    setup: (embed: MessageEmbed) => MessageEmbed,
    options: MessageEditOptions = {}
  ): Promise<SentMessageActions> {
    return this.editWithEmbed(this.returnCustomEmbed(setup), options);
  }
}
