import chalk from "chalk";
import Discord from "discord.js";

import Command from "../features/commands/classes/command";
import Context from "./context";

import version from "../config/version";

import logger from "../features/logger";

let lastUser: string;
let timestamp: number;

const logPresets = {
  /**
   * Logs startup sequence
   */
  STARTUP_SEQUENCE() {
    console.clear();
    console.log(
      ` ${chalk.hex("#abf7a7").bold("Le Jardinier")} ${chalk
        .hex("#dadada")
        .italic(`${version}`)}`
    );
    logger.line(2);
    logger.log(`Starting...`);
  },

  /**
   * Logs connection success message
   * @param tag bot's tag (username#0000)
   * @param id bot's id (discord snowflake)
   */
  BOT_CONNECTION_SUCCESS(tag: string, id: string) {
    logger.line();
    logger.log(
      `Successfully logged in as ${chalk.underline(tag)} ${chalk.grey(
        `(id: ${id})`
      )}`,
      "success"
    );
  },

  /**
   * Logs messages (username#0000: [message content])
   * and shows embed and attachments
   * also avoid logging username too much times:
   * if the same user sent several messages it doesn't logging their username
   * @param message discord message object
   */
  MESSAGE_LOG(message: Discord.Message, context: Context) {
    if (!context.hasCommand) return;

    let embeds: number = message.embeds.length;
    let attachments: number = message.attachments.toJSON().length;
    let isSystem = message.system;

    let text: string = (message.content ? `${message.content}` : "").concat(
      embeds !== 0 ? chalk.italic(` [${embeds.toString()} embeds]`) : "",
      attachments !== 0
        ? chalk.italic(` [${attachments.toString()} Attachments]`)
        : ""
    );

    if (isSystem) return;
    else if (lastUser !== message.author.id) {
      logger.line();
      logger.log(`${chalk.bold(message.author.tag)}:\n${text}`);
    } else if (message.content) logger.log(text);

    lastUser = message.author.id;
    timestamp = Date.now();
  },

  /**
   * Logs successful command execution message
   * @param command command object
   */
  COMMAND_EXECUTION_SUCCESS(command: Command) {
    logger.log(
      `Successfully executed command ${chalk.underline.bold(
        command.namespace
      )} in ${(Date.now() - timestamp) / 1000}ms`,
      "success"
    );
  },

  /**
   * Logs execution fail message
   * @param command command object
   * @param err error to log
   */
  COMMAND_EXECUTION_FAILURE(command: Command, err: any) {
    logger.log(
      `Failed to execute ${chalk.underline.bold(command.namespace)}:\n${err}`,
      "error"
    );
  },

  /**
   * Logs database pending connection message
   */
  DATABASE_CONNECTION_PENDING() {
    logger.log(`Connecting to database...`);
  },
  /**
   * Logs database connection success message
   */
  DATABASE_CONNECTION_SUCCESS() {
    logger.log(`Successfully connected to database`, "success");
  },
  /**
   * Logs database connection failure message
   */
  DATABASE_CONNECTION_FAILURE(err: any) {
    logger.log(`Failed to connect to database:\n${err}`, "error");
  },
};

export default logPresets;
