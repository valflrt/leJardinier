import chalk from "chalk";

export default class Logger {
  protected mainColor: string = "#abf7a7";
  protected successColor: string = "#41f45e";
  protected errorColor: string = "#ee7474";

  /**
   * General logging functions, all these functions have the same structure
   * @param str string to log (joined with one space)
   */
  public write(item: any) {
    process.stdout.write(`${item}`);
  }
  public writeLine(item: any) {
    console.log(`${item}`);
  }
  public log(item: any) {
    this.writeLine(this.output(item, this.mainColor));
  }
  public logString(item: any) {
    return this.output(item, this.mainColor);
  }
  public error(item: any) {
    this.writeLine(this.output(item, this.errorColor));
  }
  public errorString(item: any) {
    return this.output(item, this.errorColor);
  }
  public success(item: any) {
    this.writeLine(this.output(item, this.successColor));
  }
  public successString(item: any) {
    return this.output(item, this.successColor);
  }

  /**
   * Returns a formatted line
   * @param item item to be logged
   * @param color optional – color of the "colored block" to add at the beginning of each line
   */
  protected output(item: any, color: string = this.mainColor): string {
    return `${item}`.replace(/^/g, `${chalk.bgHex(color)(" ")} `);
  }

  public updateLine(item: any): void {
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine(0);
    this.writeLine(item);
  }

  /**
   * Clears the console
   */
  public clear() {
    console.clear();
  }

  /**
   * Adds line breaks (specified number)
   * @param number number of line breaks
   */
  public newLine(number: number = 1) {
    this.writeLine(`\n`.repeat(number - 1));
  }
}
