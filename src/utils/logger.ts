import chalk from "chalk";

class Logger {

	protected mainColor: string;
	protected successColor: string;
	protected errorColor: string;

	constructor() {
		this.mainColor = "#abf7a7";
		this.successColor = "#41f45e";
		this.errorColor = "#ee7474";
	}

	public write(...strs: string[]) {
		console.log(strs.join(" "))
	}

	public log(...strs: string[]) {
		this.output(strs.join(" "));
	}

	public error(...strs: string[]) {
		this.output(strs.join(" "), this.errorColor);
	}

	public success(...strs: string[]) {
		this.output(strs.join(" "), this.successColor);
	}

	private output(str: string, color: string = this.mainColor) {
		console.log(`${chalk.bgHex(color)(" ")} ${str.replace("\n", `\n${chalk.bgHex(color)(" ")} `)}`);
	}

}

export default new Logger();