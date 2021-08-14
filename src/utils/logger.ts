import chalk from "chalk";

class Logger {

	protected mainColor: string;
	protected errorColor: string;

	constructor() {
		this.mainColor = "#d4fdd7";
		this.errorColor = "#ee7474";
	}

	public log(...strs: string[]) {
		this.write(strs.join(" "), this.mainColor);
	}

	public error(strs: string[]) {
		this.write(strs.join(" "), this.errorColor);
	}

	private write(str: string, color: string) {
		console.log(`${chalk.bgHex(color)(" ")} ${str.replace("\n", `\n${chalk.bgHex(color)(" ")} `)}`);
	}

}

export default new Logger();