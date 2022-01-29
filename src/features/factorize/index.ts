/**
 * Turns large numbers into small numbers with suffixes
 * e.g.: 1000 > 1K, 44564 > 464.6K, ...
 */
class Factorize {
  /**
   * Regexps to match: thousands, millions, billions
   */
  private static regexps = {
    billion: /(?<=\d+)\d{9}(?<=(\.\d)?)/,
    million: /(?<=\d+)\d{6}(?<=(\.\d)?)/,
    thousand: /(?<=\d+)\d{3}(?<=(\.\d)?)/,
    overflowFix: /(?<=\d+\.\d)\d+/,
  };

  /**
   * Functions to round numbers depending on their size (thousands, millions, billions)
   */
  private static rounders = {
    billion: (number: number) => Math.round(number * 10 ** -8) * 10 ** -1,
    million: (number: number) => Math.round(number * 10 ** -5) * 10 ** -1,
    thousand: (number: number) => Math.round(number * 10 ** -2) * 10 ** -1,
  };

  /**
   * Parses a string
   * @param string string to parse
   */
  public static fromString(string: string): string {
    let number = Number.parseFloat(string);

    if (this.regexps.billion.test(string)) {
      return this.rounders
        .billion(number)
        .toString()
        .replace(this.regexps.overflowFix, "")
        .concat("B");
    } else if (this.regexps.million.test(string)) {
      return this.rounders
        .million(number)
        .toString()
        .replace(this.regexps.overflowFix, "")
        .concat("M");
    } else if (this.regexps.thousand.test(string)) {
      return this.rounders
        .thousand(number)
        .toString()
        .replace(this.regexps.overflowFix, "")
        .concat("K");
    } else return string;
  }

  /**
   * Parses a number
   * @param number number to parse
   */
  public static fromNumber(number: number): string {
    let string = number.toString();

    if (this.regexps.billion.test(string)) {
      return this.rounders
        .billion(number)
        .toString()
        .replace(this.regexps.overflowFix, "")
        .concat("B");
    } else if (this.regexps.million.test(string)) {
      return this.rounders
        .million(number)
        .toString()
        .replace(this.regexps.overflowFix, "")
        .concat("M");
    } else if (this.regexps.thousand.test(string)) {
      return this.rounders
        .thousand(number)
        .toString()
        .replace(this.regexps.overflowFix, "")
        .concat("K");
    } else return string;
  }
}

export default Factorize;
