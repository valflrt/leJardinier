import chalk from "chalk";
import Discord from "discord.js";

import Command from "../features/commands/classes/command";
import Context from "./context";

import version from "../config/version";

class BaseLogger {
  protected mainColor: string = "#abf7a7";
  protected successColor: string = "#41f45e";
  protected errorColor: string = "#ee7474";

  /**
   * General logging functions, all these functions have the same structure
   * @param str string to log (joined with one space)
   */
  public write = (item: any) => console.log(item);
  public log = (str: string) => this.output(str, this.mainColor);
  public error = (str: string) => this.output(str, this.errorColor);
  public success = (str: string) => this.output(str, this.successColor);

  /**
   * Clears the console
   */
  public clear = () => console.clear();

  /**
   * Adds line breaks (specified number)
   * @param number number of line breaks
   */
  public newLine = (number: number = 1) => this.write(`\n`.repeat(number - 1));

  /**
   * Logs time
   */
  public time = () => this.write(new Date().toLocaleTimeString());

  /**
   *
   * @param str string to log
   * @param color optional – color of the "color block" at the str beginning
   */
  protected output = (str: string, color: string = this.mainColor) =>
    console.log(
      `${chalk.bgHex(color)(" ")} `.concat(
        str.replace(/\n/g, `\n${chalk.bgHex(color)(" ")} `)
      )
    );
}

class Logger extends BaseLogger {
  /**
   * Logs startup sequence
   */
  public startupSequence() {
    this.clear();
    this.write(
      ` ${chalk.hex("#abf7a7").bold("Le Jardinier")} ${chalk
        .rgb(200, 220, 210)
        .italic(`${version}`)} 🍀 ${chalk.rgb(200, 220, 210)("by valflrt")}`
    );
    this.newLine(2);
    this.log(`Starting...`);
  }

  /**
   * Logs connection success message
   * @param tag bot's tag (username#0000)
   * @param id bot's id (discord snowflake)
   */
  public connectionSuccess(tag: string, id: string) {
    this.success(
      `Successfully logged in as ${chalk.underline(tag)} ${chalk.grey(
        `(id: ${id})`
      )}`
    );
  }
}

class MessageLogger extends Logger {
  private lastUser: string | null = null;

  /**
   * Logs messages (username#0000: [message content])
   * and shows embed and attachments
   * also avoid logging username too much times:
   * if the same user sent several messages it doesn't logging their username
   * @param message discord message object
   */
  public message = (message: Discord.Message, context: Context) => {
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
      this.newLine();
      this.log(`${chalk.bold(message.author.tag)}:\n${text}`);
    } else if (message.content) this.log(text);

    this.lastUser = message.author.id;
  };
}

class CommandLogger extends Logger {
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
    this.success(
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
    this.error(
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

class DatabaseLogger extends Logger {
  public connectionSuccess() {
    this.success(`Successfully connected to database`);
  }
  public connectionFailure(err: any) {
    this.error(`Failed to connect to database:\n${err}`);
  }

  public userAdditionSuccess() {
    this.success(`User added successfully`);
  }
  public userAdditionFailure(err: any) {
    this.error(`Failed to add user:\n${err}`);
  }

  public statAdditionSuccess() {
    this.success(`Stat added successfully`);
  }
  public statAdditionFailure(err: any) {
    this.error(`Failed to add stat:\n${err}`);
  }
}

const system = new BaseLogger();
const logger = new Logger();
const message = new MessageLogger();
const command = new CommandLogger();
const database = new DatabaseLogger();

export default {
  system,
  logger,
  message,
  command,
  database,
};
