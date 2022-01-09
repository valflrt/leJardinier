import {
  Message,
  MessageEmbed,
  ReplyMessageOptions,
} from "discord.js/typings/index.js";

export interface SentMessage extends Message {
  editWithEmbed: (
    embed: MessageEmbed,
    options?: ReplyMessageOptions
  ) => Promise<Message>;
  editWithTextEmbed: (
    text: string,
    options?: ReplyMessageOptions
  ) => Promise<Message>;
  editWithCustomEmbed: (
    setup: (embed: MessageEmbed) => MessageEmbed,
    options?: ReplyMessageOptions
  ) => Promise<Message>;
}
