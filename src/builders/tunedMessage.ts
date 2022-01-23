import {
  Message,
  MessageEmbed,
  MessagePayload,
  ReplyMessageOptions,
} from "discord.js";

import Context from "../bot/context";

import { mix } from "../utils";

export default class TunedMessageBuilder {
  protected message: Message;
  protected context: Context;

  constructor(message: Message, context: Context) {
    this.message = message;
    this.context = context;
  }

  public build(): ITunedMessage {
    return Object.assign(this.message, this);
  }

  /**
   * sends a message in the current channel
   * @param options messages options
   */
  public send = async (
    options: string | MessagePayload | ReplyMessageOptions
  ): Promise<IEditableTunedMessage> => {
    return this.generateEditableTunedMessage(
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
  ): Promise<IEditableTunedMessage> => {
    if (!options.embeds) options.embeds = [];
    options.embeds.push(embed);
    return this.generateEditableTunedMessage(await this.message.reply(options));
  };

  /**
   * sends an embed
   * @param content text to send
   * @param options message options
   */
  public sendTextEmbed = async (
    content: string,
    options: ReplyMessageOptions = {}
  ): Promise<IEditableTunedMessage> => {
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
  ): Promise<IEditableTunedMessage> => {
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

  protected async generateEditableTunedMessage(
    message: Message
  ): Promise<IEditableTunedMessage> {
    return new EditableTunedMessageBuilder(
      message,
      new Context(this.message)
    ).build();
  }
}

export class EditableTunedMessageBuilder extends TunedMessageBuilder {
  public build(): IEditableTunedMessage {
    return mix(this.message as IEditableTunedMessage, this);
  }

  public editWithEmbed = async (
    embed: MessageEmbed,
    options: ReplyMessageOptions = {}
  ): Promise<IEditableTunedMessage> => {
    if (!options.embeds) options.embeds = [];
    options.embeds.push(embed);
    return this.generateEditableTunedMessage(await this.message.edit(options));
  };

  editWithTextEmbed = (
    text: string,
    options: ReplyMessageOptions = {}
  ): Promise<IEditableTunedMessage> => {
    return this.editWithEmbed(this.returnTextEmbed(text), options);
  };

  editWithCustomEmbed = (
    setup: (embed: MessageEmbed) => MessageEmbed,
    options: ReplyMessageOptions = {}
  ): Promise<IEditableTunedMessage> => {
    return this.editWithEmbed(this.returnCustomEmbed(setup), options);
  };
}

export interface ITunedMessage extends Message {
  /**
   * sends a message in the current channel
   * @param options messages options
   */
  send(
    options: string | MessagePayload | ReplyMessageOptions
  ): Promise<Message>;

  /**
   * sends an already created MessageEmbed
   * @param embed already created embed
   * @param options message options
   */
  sendEmbed(
    embed: MessageEmbed,
    options?: ReplyMessageOptions
  ): Promise<IEditableTunedMessage>;

  /**
   * sends an embed
   * @param content text to send
   * @param options message options
   */
  sendTextEmbed(
    content: string,
    options?: ReplyMessageOptions
  ): Promise<IEditableTunedMessage>;

  /**
   * returns a simple text embed
   * @param content text to send as the description of the MessageEmbed
   */
  returnTextEmbed(content: string): MessageEmbed;

  /**
   * creates a custom MessageEmbed using a callback and sends it
   * @param setup the callback function
   * @param options message options
   */
  sendCustomEmbed(
    setup: (embed: MessageEmbed) => MessageEmbed,
    options?: ReplyMessageOptions
  ): Promise<IEditableTunedMessage>;

  /**
   * sets up a custom embed and returns it
   * @param setup the callback function
   */
  returnCustomEmbed(setup: (embed: MessageEmbed) => MessageEmbed): MessageEmbed;
}

export interface IEditableTunedMessage extends ITunedMessage {
  /**
   * Edits the message with an embed
   * @param embed embed to edit the message with
   * @param options edit options
   */
  editWithEmbed(
    embed: MessageEmbed,
    options?: ReplyMessageOptions
  ): Promise<Message>;

  /**
   * Edits the message with text
   * @param text text to edit the message with
   * @param options edit options
   */
  editWithTextEmbed(
    text: string,
    options?: ReplyMessageOptions
  ): Promise<Message>;

  /**
   * Edits the message with a custom embed
   * @param embed functions to setup the custom embed
   * @param options edit options
   */
  editWithCustomEmbed(
    embed: (embed: MessageEmbed) => MessageEmbed,
    options?: ReplyMessageOptions
  ): Promise<Message>;
}
