import chalk from "chalk";
import Discord from "discord.js";

import { ICommand } from "../types";
import config from "../config";

class Logger {
	protected mainColor: string = "#abf7a7";
	protected successColor: string = "#41f45e";
	protected errorColor: string = "#ee7474";

	/**
	 * general logging functions
	 * all these functions have the same structure
	 * @param str string to log (joined with one space)
	 */
	public write = (item: any) => console.log(item);
	public log = (str: string) => this.output(str, this.mainColor);
	public error = (str: string) => this.output(str, this.errorColor);
	public success = (str: string) => this.output(str, this.successColor);

	/**
	 * clears the console
	 */
	public clear = () => console.clear();

	/**
	 * adds line breaks (specified number)
	 * @param number number of line breaks
	 */
	public newLine = (number: number = 1) =>
		this.write(`\n`.repeat(number - 1));

	/**
	 * logs time
	 */
	public time = () => this.write(new Date().toLocaleTimeString());

	/**
	 *
	 * @param str string to log
	 * @param color color of the "color block" at the str beginning
	 */
	protected output = (str: string, color: string = this.mainColor) =>
		console.log(
			`${chalk.bgHex(color)(" ")} ${str} `.replace(
				/\n/g,
				`\n${chalk.bgHex(color)(" ")} `
			)
		);
}

class SystemLogger extends Logger {
	/**
	 * logs init sequence
	 */
	public starting = () => {
		this.clear();
		this.write(
			` ${chalk.hex("#abf7a7").bold`Le Jardinier`} ${chalk.rgb(
				200,
				220,
				210
			).italic(`v${config.version}`)} 🍀 ${chalk.rgb(200, 220, 210)(`by valflrt`)}`
		);
		this.newLine(2);
		this.log(`Starting...`);
	};
}

class BotLogger extends Logger {
	private lastChatlogUser: string;

	constructor() {
		super();
		this.lastChatlogUser = "";
	}

	/**
	 * logs messages (username#0000: [message content])
	 * and shows embed and attachments
	 * also avoid logging username too much times:
	 * if the same user sent several messages it doesn't logging their username
	 * @param message discord message object
	 */
	public message = (message: Discord.Message) => {
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
		else if (this.lastChatlogUser !== message.author.id) {
			this.newLine();
			this.log(`${chalk.bold(message.author.tag)}:\n${text}`);
		} else if (message.content) this.log(text);

		this.lastChatlogUser = message.author.id;
	};

	/**
	 * logs a success message when the bot connected
	 * @param tag bot's tag (username#0000)
	 * @param id bot's id (discord snowflake)
	 */
	public connected = (tag: string, id: string) =>
		this.success(
			`Successfully logged in as ${chalk.underline(
				tag
			)} ${chalk.grey.italic(`(id: ${id})`)}`
		);
}

class CommandLogger extends Logger {
	private startTime: number;

	constructor() {
		super();
		this.startTime = Date.now();
	}

	/**
	 * sets time to measure command execution time
	 * @returns {number} current date (time)
	 */
	public startTimer = (): number => (this.startTime = Date.now());

	/**
	 * returns elapsed time
	 * @returns {string} elapsed time
	 */
	public getElapsedTime = (): string =>
		`${(Date.now() - this.startTime) / 1000}ms`;

	/**
	 * logs a success message when a command executed correctly
	 * @param command {ICommand} command object
	 */
	public executed = (command: ICommand) =>
		this.success(
			`Successfully executed command ${chalk.underline.bold(
				command.syntax
			)} in ${this.getElapsedTime()}`
		);

	/**
	 * logs a failure message
	 * @param command {ICommand} command object
	 * @param err error to log
	 */
	public executionFailed = (command: ICommand, err: any) =>
		this.error(
			`Failed to execute ${chalk.underline.bold(command.syntax)}:\n${err}`
		);
}

class DatabaseLogger extends Logger {
	public connectionSuccess = () =>
		this.success(`Successfully connected to database`);
	public connectionFailed = (err: any) =>
		this.error(`Failed to connect to database:\n${err}`);

	public userAddedSuccessfully = () =>
		this.success(`User added successfully`);
	public failedToAddUser = (err: any) =>
		this.error(`Failed to add user:\n${err}`);

	public statAddedSuccessfully = () =>
		this.success(`Stat added successfully`);
	public failedToAddStat = (err: any) =>
		this.error(`Failed to add stat:\n${err}`);
}

export const logger = new Logger();
export const system = new SystemLogger();
export const bot = new BotLogger();
export const command = new CommandLogger();
export const database = new DatabaseLogger();

export default {
	logger,
	system,
	bot,
	command,
	database,
};
