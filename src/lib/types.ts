import {
    Message,
    MessageEmbed,
    ReplyMessageOptions,
} from "discord.js/typings/index.js";
import MessageInstance from "../bot/message";

export interface ICommand {
    name: string;
    description: string;
    arguments?: string;
    syntax?: string;
    categoryName?: string;
    requiresDB?: boolean;
    execution: (messageInstance: MessageInstance) => Promise<any>;
    commands?: ICommand[];
}

export interface ICategory {
    name: string;
    commands: ICommand[];
}

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

export interface IConfig {
    version: `v${string}`;
    local: ILocalConfig;
    secrets: ISecrets;
}

export interface ILocalConfig {
    prefix: string;
}

export interface ISecrets {
    token: string;
    youtubeApiKey: string;
    databaseURI: string;
}
