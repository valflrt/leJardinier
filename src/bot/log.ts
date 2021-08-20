import chalk from "chalk";
import Discord from "discord.js";

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
	public write = (...strs: string[]) => console.log(strs.join(" "));
	public log = (...strs: string[]) => this.output(strs.join(" "));
	public error = (...strs: string[]) => this.output(strs.join(" "), this.errorColor);
	public success = (...strs: string[]) => this.output(strs.join(" "), this.successColor);

	/**
	 * clears the console
	 */
	public clear = () => console.clear();

	/**
	 * adds line breaks (specified number)
	 * @param number number of line breaks
	 * @author valflrt
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
	private output = (str: string, color: string = this.mainColor) =>
		console.log(`${chalk.bgHex(color)(" ")} ${str.replace("\n", `\n${chalk.bgHex(color)(" ")} `)}`);

}

class BotLogger extends Logger {

	private lastChatlogUser: string;

	constructor() {
		super();
		this.lastChatlogUser = "";
	}

	/**
	 * logs every message (username#0000: message content)
	 * @param messageObject discord message object
	 * @author valflrt
	 */
	public message = (messageObject: Discord.Message) => {
		if (this.lastChatlogUser !== messageObject.author.id) {
			this.newLine();
			this.log(`${chalk.bold(messageObject.author.tag)}:\n${messageObject.content ? `${messageObject.content}` : ""}`);
		} else if (messageObject.content) this.log(messageObject.content);
		this.lastChatlogUser = messageObject.author.id;
	}

	/**
	 * logs a success message when the bot connected
	 * @param tag bot's tag (username#0000)
	 * @param id bot's id (discord snowflake)
	 * @author valflrt
	 */
	public connected = (tag: string, id: string) => this.success(`successfully logged in as ${chalk.underline(tag)} ${chalk.grey.italic(`(id: ${id})`)}`);


}

export const logger = new Logger();
export const bot = new BotLogger();