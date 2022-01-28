import Command from "./command";

export default class CommandList {
  private _commands: Command[] = [];
  private _categories: Map<string, Command[]> = new Map();

  /**
   * adds a subcommand
   * @param config function taking a new CCommand as only argument, used to configure
   * a CCommand
   * note: you can do the same as explained in CCommand#addParameter
   * @param categoryName name of the category of the command
   */
  public addCommand(command: Command, categoryName?: string): CommandList {
    this._commands.push(command);
    if (categoryName) {
      !this.categories.has(categoryName) &&
        this.categories.set(categoryName, []);
      this.categories.get(categoryName)!.push(command);
    }
    return this;
  }

  /**
   * finds and returns a command in the list using a command pattern generated
   * by class CMessageParser. if the command isn't found, returns null
   * @param pattern command call pattern
   */
  public find(pattern: string[]): Command | null {
    const loop = (currentLevel: Command[] = [], i: number): Command | null => {
      let command = currentLevel.find((c) => c.equals(pattern[i]));
      if (i === pattern.length - 1 && command) return command!;
      else if (command && command.commands.length !== 0) {
        return loop(command.commands, i + 1);
      } else return null;
    };

    return loop(this.commands, 0);
  }

  /**
   * finds and returns a command using an namespace
   * @param namespace string that contains the "path" to the command
   */
  public get(namespace: string): Command | null {
    let command = this.commands.find((c) => c.namespace === namespace);
    return command ? command : null;
  }

  public get commands(): Command[] {
    return this._commands;
  }

  public get categories(): Map<string, Command[]> {
    return this._categories;
  }
}
