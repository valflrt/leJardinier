import chalk from "chalk";

export class Logger {
  public colors = {
    main: "#abf7a7",
    success: "#41f45e",
    error: "#ee7474",
  };

  /**
   * Custom log function
   * @param item item to log
   */
  public log(item: any, color: keyof typeof this.colors = "main") {
    console.log(
      // writes a colored "block" at the beginning of every line
      `${item}`.replace(/^/gm, `${chalk.bgHex(this.colors[color])(" ")} `)
    );
  }

  /**
   * Logs one or more new line(s)
   * @param number optional – number of lines to skip
   */
  public line(number: number = 1) {
    console.log("\n".repeat(number - 1));
  }
}

const logger = new Logger();

export default logger;
