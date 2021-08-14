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

	public write = (...strs: string[]) => console.log(strs.join(" "));
	public log = (...strs: string[]) => this.output(strs.join(" "));
	public error = (...strs: string[]) => this.output(strs.join(" "), this.errorColor);
	public success = (...strs: string[]) => this.output(strs.join(" "), this.successColor);

	public clear = () => console.clear();
	public newLine = (number: number = 1) => this.write(`\n`.repeat(number - 1));
	public time = () => this.write(new Date().toLocaleTimeString());

	private output = (str: string, color: string = this.mainColor) =>
		console.log(`${chalk.bgHex(color)(" ")} ${str.replace("\n", `\n${chalk.bgHex(color)(" ")} `)}`);

}

class BotLogger extends Logger {

	constructor() {
		super();
	}

	public message = (messageObject: Discord.Message) => this.write(messageObject.content, messageObject.author.tag);

	public connected = (tag: string) => {
		this.success(`logged in successfully as ${chalk.underline(tag)}`);
		this.newLine();
	};

}

export default {
	logger: new Logger(),
	bot: new BotLogger()
}