import chalk from "chalk";
import Discord from "discord.js";

import Command from "../features/commands/classes/command";
import Context from "./context";

import version from "../config/version";

import Logger from "../features/logger";

const logger = new Logger();

class BotLogger {
  /**
   * Logs startup sequence
   */
  startupSequence() {
    logger.clear();
    logger.writeLine(
      ` ${chalk.hex("#abf7a7").bold("Le Jardinier")} ${chalk
        .hex("#dadada")
        .italic(`${version}`)}`
    );
    logger.newLine(2);
    logger.log(`Starting...`);
  }
  /**
   * Logs connection success message
   * @param tag bot's tag (username#0000)
   * @param id bot's id (discord snowflake)
   */
  connectionSuccess(tag: string, id: string) {
    logger.success(
      `Successfully logged in as ${chalk.underline(tag)} ${chalk.grey(
        `(id: ${id})`
      )}`
    );
  }
}

class MessageLogger {
  private lastUser: string | null = null;

  /**
   * Logs messages (username#0000: [message content])
   * and shows embed and attachments
   * also avoid logging username too much times:
   * if the same user sent several messages it doesn't logging their username
   * @param message discord message object
   */
  public logMessage(message: Discord.Message, context: Context) {
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
    else if (this.lastUser !== message.author.id) {
      logger.newLine();
      logger.log(`${chalk.bold(message.author.tag)}:\n${text}`);
    } else if (message.content) logger.log(text);

    this.lastUser = message.author.id;
  }
}

class CommandLogger {
  private timestamp: number = 0;

  /**
   * Sets timestamp to measure command execution time
   */
  public setTimestamp() {
    this.timestamp = Date.now();
  }

  /**
   * Logs successful command execution message
   * @param command command object
   */
  public executionSuccess(command: Command) {
    logger.success(
      `Successfully executed command ${chalk.underline.bold(
        command.namespace
      )} in ${this.elapsedTime}`
    );
  }

  /**
   * Logs execution fail message
   * @param command command object
   * @param err error to log
   */
  public executionFailure(command: Command, err: any) {
    logger.error(
      `Failed to execute ${chalk.underline.bold(command.namespace)}:\n${err}`
    );
  }

  /**
   * Returns elapsed time
   */
  public get elapsedTime(): string {
    return `${(Date.now() - this.timestamp) / 1000}ms`;
  }
}

class DatabaseLogger {
  public pendingConnection() {
    logger.log(`Connecting to database...`);
  }
  public connectionSuccess() {
    logger.updateLine(
      logger.successString(`Successfully connected to database`)
    );
  }
  public connectionFailure(err: any) {
    logger.updateLine(
      logger.errorString(`Failed to connect to database:\n${err}`)
    );
  }
}

export const botLogger = new BotLogger();
export const messageLogger = new MessageLogger();
export const commandLogger = new CommandLogger();
export const databaseLogger = new DatabaseLogger();

export default logger;
