import Context from "../../bot/context";

import CommandPreview from "../formatters/commandPreview";

import config from "../../config";

export interface ICommandDeclaration {
  name: string;
  identifier: string;
  description: string;

  execution: TExecutionFunction;

  commands: Command[];
  parameters: ICommandParameterDeclaration[];
  aliases: string[];

  settings: ICommandSettingsDeclaration;
}

export interface ICommandParameterDeclaration {
  name: string;
  required?: boolean;
}

export interface ICommandSettingsDeclaration {
  hidden?: boolean;
  noHelpCommand?: boolean;
}

export type TExecutionFunction = (context: Context) => Promise<any>;

export interface ICommandOptions {
  /**
   * Command name
   */
  name: string;
  /**
   * Command identifier, if not set name is used instead
   */
  identifier?: string;
  /**
   * Command description
   */
  description: string;

  /**
   * Command execution, a function returning a the execution function
   */
  execution: (command: Command) => TExecutionFunction;

  /**
   * Command subcommands, a function returning an array of `Command`
   */
  commands?: (command: Command) => Command[];
  /**
   * Command parameters
   */
  parameters?: ICommandParameterDeclaration[];
  /**
   * Command aliases, can be used to call the function instead of using its original name
   */
  aliases?: string[];

  /**
   * Command settings
   */
  settings?: ICommandSettingsDeclaration;
}

export default class Command implements ICommandDeclaration {
  private _name!: string;
  private _identifier!: string;
  private _description!: string;

  private _execution!: TExecutionFunction;

  private _commands: Command[] = [];
  private _parameters: ICommandParameterDeclaration[] = [];
  private _aliases: string[] = [];

  private _settings: ICommandSettingsDeclaration = {};

  private _parent: Command | null = null;

  constructor(commandOptions: ICommandOptions) {
    // basic options
    this.name = commandOptions.name;
    this.identifier = commandOptions.identifier;
    this.description = commandOptions.description;

    this.parameters = commandOptions.parameters;
    this.aliases = commandOptions.aliases;

    this.settings = commandOptions.settings;

    // "requires command" setup
    if (commandOptions.commands) this.commands = commandOptions.commands(this);
    this.execution = commandOptions.execution(this);

    // finishing setup
    if (!this.settings.noHelpCommand) this.addHelpCommand();
  }

  // specific methods

  /**
   * Returns true if a command equals an other using identifier (including aliases)
   * @param identifier other command identifier
   */
  public equals(identifier: string): boolean {
    return this.identifier === identifier ||
      !!this.aliases.find((a) => a === identifier)
      ? true
      : false;
  }

  /**
   * Adds an help subcommand
   */
  private addHelpCommand() {
    this.commands.push(
      new Command({
        name: "help",
        description: `Help command for command "${this.namespace}"`,
        settings: { hidden: true, noHelpCommand: true },
        execution:
          () =>
          async ({ actions }) => {
            actions.sendCustomEmbed((embed) =>
              embed
                .setDescription(this.preview.getFullPreview())
                .addFields(this.preview.embedFields)
            );
          },
      })
    );
  }

  // setters and getters

  /**
   * Command name
   */
  public get name(): string {
    return this._name;
  }
  public set name(v: string) {
    this._name = v.toLowerCase().trim();
  }

  /**
   * Command identifier
   */
  public get identifier(): string {
    return this._identifier;
  }
  public set identifier(v: string | undefined) {
    this._identifier = v ? v.toLowerCase().trim() : this.name;
  }

  /**
   * Command description
   */
  public get description(): string {
    return this._description;
  }
  public set description(v: string) {
    this._description = v.trim();
  }

  /**
   * Command execution
   */
  public get execution(): TExecutionFunction {
    return this._execution;
  }
  public set execution(v: TExecutionFunction) {
    this._execution = v;
  }

  /**
   * Subcommand list
   */
  public get commands(): Command[] {
    return this._commands;
  }
  public set commands(v: Command[] | undefined) {
    if (v) {
      v.forEach((v) => (v.parent = this));
      this._commands = v;
    }
  }

  /**
   * Alias-es list
   */
  public get aliases(): string[] {
    return this._aliases;
  }
  public set aliases(v: string[] | undefined) {
    if (v) {
      this._aliases = v.map((v) => v.toLowerCase().trim());
    }
  }

  /**
   * Parameter list
   */
  public get parameters(): ICommandParameterDeclaration[] {
    return this._parameters;
  }
  public set parameters(v: ICommandParameterDeclaration[] | undefined) {
    if (v) {
      v.forEach((v) => v.name.toLowerCase().trim());
      this._parameters = v;
    }
  }

  /**
   * Parent command
   */
  public get parent(): Command | null {
    return this._parent;
  }
  public set parent(v: Command | null | undefined) {
    if (!v) return;
    this._parent = v;
  }

  /**
   * Command settings
   */
  public get settings(): ICommandSettingsDeclaration {
    return this._settings;
  }
  public set settings(v: ICommandSettingsDeclaration | undefined) {
    if (!v) return;
    this._settings = v;
  }

  // specific getters

  /**
   * Returns the number of subcommands of the current command
   */
  public get commandCount(): number {
    return this.commands.filter((c) => !c.settings.hidden).length;
  }

  /**
   * Returns a formatted syntax for current command
   */
  public get syntax(): string {
    return `${config.prefix}${this.namespace}${
      this.parameters.length !== 0 ? " " : ""
    }${this.parameters
      .map((p) => `[${p.required !== true ? "?" : ""}${p.name}]`)
      .join(" ")}`;
  }

  /**
   * Returns an namespace in the form:
   * [parent commands namespace separated by dots][current command identifier]
   * @example help.command.name
   */
  public get namespace(): string {
    return `${this.parent !== null ? `${this.parent.namespace}.` : ""}${
      this.identifier
    }`;
  }

  public get preview(): CommandPreview {
    return new CommandPreview(this);
  }
}
