import Command from "./command";

export default class CommandList {
  private _commands: Command[] = [];
  private _categories: Map<string, Command[]> = new Map();

  /**
   * Adds a subcommand
   * @param command command to add
   * @param categoryName optional – name of the category of the command if not specified set to "Uncategorized"
   */
  public addCommand(
    command: Command,
    categoryName: string = "Uncategorized"
  ): CommandList {
    this._commands.push(command);
    if (categoryName) {
      !this.categories.has(categoryName) &&
        this.categories.set(categoryName, []);
      this.categories.get(categoryName)!.push(command);
    }
    return this;
  }

  /**
   * Finds and returns a command in the list using a "command pattern"
   * If the command isn't found, returns null
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
   * Finds and returns a command using an namespace
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
