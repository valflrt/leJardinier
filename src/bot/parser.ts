import config from "../config";

export default class CMessageParser {
  public readonly pattern: string[] = [];
  public readonly parameters: string;

  constructor(messageText: string) {
    this.pattern = messageText
      .replace(new RegExp(`(^${config.prefix})|( .*$)`, "g"), "")
      .trim()
      .split(/(?!^)\.(?!$)/g);
    this.parameters = messageText
      .replace(new RegExp(`^((?:${config.prefix}\\w+)(\\.\\w*)* *)`, "g"), "")
      /**
       * the two lines bellow remove accented characters
       * don't ask me how: **I don't know** (found it on stack overflow)
       */
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }
}
