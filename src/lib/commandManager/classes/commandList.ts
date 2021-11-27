import CCommand from "./command";

export default class CCommandList {
  private _commands: CCommand[] = [];
  private _categories: Map<string, CCommand[]> = new Map();

  public addCommand(
    config: (command: CCommand) => CCommand,
    categoryName?: string
  ) {
    let command = config(new CCommand());
    this._commands.push(command);
    if (categoryName) {
      let category = this.categories.get(categoryName);
      if (!category) this.categories.set(categoryName, []);
      this.categories.get(categoryName)!.push(command);
    }
  }

  public find(pattern: string[]) {
    const loop = (
      currentLevel: CCommand[] = [],
      i: number
    ): CCommand | null => {
      let command = currentLevel.find((c) => c.name === pattern[i]);
      if (i === pattern.length - 1 && command) return command!;
      else if (command && command.commands.length !== 0) {
        return loop(command.commands, i + 1);
      } else return null;
    };

    return loop(this.commands, 0);
  }

  public get commands(): CCommand[] {
    return this._commands;
  }

  public get categories(): Map<string, CCommand[]> {
    return this._categories;
  }
}
