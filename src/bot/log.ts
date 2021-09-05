import chalk from "chalk";
import Discord from "discord.js";
import { ICommand } from "../types";

class Logger {

	protected mainColor: string;
	protected successColor: string;
	protected errorColor: string;

	constructor() {
		this.mainColor = "#abf7a7";
		this.successColor = "#41f45e";
		this.errorColor = "#ee7474";
	}

	/**
	 * general logging functions 
	 * all these functions have the same structure
	 * @param strs strings to log (joined with one space)
	 */
	public write = (...strs: any[]) => console.log(strs.join(" "));
	public log = (...strs: any[]) => this.output(strs.join(" "));
	public error = (...strs: any[]) => this.output(strs.join(" "), this.errorColor);
	public success = (...strs: any[]) => this.output(strs.join(" "), this.successColor);

	/**
	 * clears the console
	 */
	public clear = () => console.clear();

	/**
	 * adds line breaks (specified number)
	 * @param number number of line breaks
	 */
	public newLine = (number: number = 1) => this.write(`\n`.repeat(number - 1));

	/**
	 * logs time
	 */
	public time = () => this.write(new Date().toLocaleTimeString());

	/**
	 * 
	 * @param str string to log
	 * @param color color of the "color block" at the str beginning
	 */
	protected output = (str: any, color: string = this.mainColor) =>
		console.log(`${chalk.bgHex(color)(" ")} ${str.replace("\n", `\n${chalk.bgHex(color)(" ")} `)}`);

}

class BotLogger extends Logger {

	private lastChatlogUser: string;

	constructor() {
		super();
		this.lastChatlogUser = "";
	}

	/**
	 * logs messages (username#0000: [message content])
	 * @param message discord message object
	 */
	public message = (message: Discord.Message) => {

		let embeds: number = message.embeds.length;
		let attachments: number = message.attachments.toJSON().length;

		let text: string = (message.content ? `${message.content}` : "")
			.concat(
				embeds !== 0 ? chalk.italic(` [${embeds.toString()} embeds]`) : "",
				attachments !== 0 ? chalk.italic(` [${attachments.toString()} Attachments]`) : ""
			)

		if (this.lastChatlogUser !== message.author.id) {
			this.newLine();
			this.log(`${chalk.bold(message.author.tag)}:\n${text}`);
		} else if (message.content) this.log(text);

		this.lastChatlogUser = message.author.id;
	}

	/**
	 * logs a success message when the bot connected
	 * @param tag bot's tag (username#0000)
	 * @param id bot's id (discord snowflake)
	 */
	public connected = (tag: string, id: string) => this.success(`successfully logged in as ${chalk.underline(tag)} ${chalk.grey.italic(`(id: ${id})`)}`);


}

class CommandLogger extends Logger {

	public executed = (command: ICommand) => this.success(`Successfully executed ${chalk.bold(command.name)}`);
	public executionFailed = (command: ICommand, err: any) => this.error(`Failed to execute ${chalk.bold(command.name)}:\n${err}`);

}

export const logger = new Logger();
export const bot = new BotLogger();
export const command = new CommandLogger();

export default {
	logger,
	bot,
	command
}