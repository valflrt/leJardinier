import {
  Message,
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
   * sends a message in the current channel
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
   * sends an already created MessageEmbed
   * @param embed already created embed
   * @param options message options
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
   * sends an embed
   * @param content text to send
   * @param options message options
   */
  public sendTextEmbed = async (
    content: string,
    options: ReplyMessageOptions = {}
  ): Promise<SentMessageActions> => {
    return await this.sendEmbed(this.returnTextEmbed(content), options);
  };

  /**
   * returns a simple text embed
   * @param content text to send as the description of the MessageEmbed
   */
  public returnTextEmbed = (content: string): MessageEmbed => {
    return this.context.embed.setDescription(content);
  };

  /**
   * creates a custom MessageEmbed using a callback and sends it
   * @param setup the callback function
   * @param options message options
   */
  public sendCustomEmbed = async (
    setup: (embed: MessageEmbed) => MessageEmbed,
    options: ReplyMessageOptions = {}
  ): Promise<SentMessageActions> => {
    return await this.sendEmbed(this.returnCustomEmbed(setup), options);
  };

  /**
   * sets up a custom embed and returns it
   * @param setup the callback function
   */
  public returnCustomEmbed = (
    setup: (embed: MessageEmbed) => MessageEmbed
  ): MessageEmbed => {
    return setup(this.context.embed);
  };

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

  public editWithEmbed = async (
    embed: MessageEmbed,
    options: ReplyMessageOptions = {}
  ): Promise<SentMessageActions> => {
    if (!options.embeds) options.embeds = [];
    options.embeds.push(embed);
    return this.attachSentMessageActions(await this.message.edit(options));
  };

  public editWithTextEmbed(
    text: string,
    options: ReplyMessageOptions = {}
  ): Promise<SentMessageActions> {
    return this.editWithEmbed(this.returnTextEmbed(text), options);
  }

  public editWithCustomEmbed(
    setup: (embed: MessageEmbed) => MessageEmbed,
    options: ReplyMessageOptions = {}
  ): Promise<SentMessageActions> {
    return this.editWithEmbed(this.returnCustomEmbed(setup), options);
  }
}
