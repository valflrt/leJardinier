import TExecutionFunction from "../types/executionFunction";
import ICommandSettings from "../types/commandSettings";
import CommandPreview from "./commandPreview";

import config from "../../../config";

interface ICommandSetup {
  name: string;
  identifier?: string;
  description: string;

  execution: TExecutionFunction;

  commands?: Command[];
  parameters?: ICommandParameter[];
  aliases?: string[];

  settings?: ICommandSettings;
}

interface ICommandParameter {
  name: string;
  required?: boolean;
}

export default class Command implements ICommandSetup {
  private _name!: string;
  private _identifier!: string;
  private _description!: string;

  private _execution!: TExecutionFunction;

  private _commands: Command[] = [];
  private _parameters: ICommandParameter[] = [];
  private _aliases: string[] = [];

  private _settings: ICommandSettings = {};

  private _parent: Command | null = null;

  constructor(command: ICommandSetup) {
    this.name = command.name;
    this.identifier = command.identifier;
    this.description = command.description;

    this.execution = command.execution;

    this.commands = command.commands;
    this.parameters = command.parameters;
    this.aliases = command.aliases;

    this.settings = command.settings;

    this.addHelpCommand();
  }

  // specific methods

  /**
   * returns true if a command equals an other using identifier (including aliases)
   * @param identifier other command identifier
   */
  public equals(identifier: string): boolean {
    return this.identifier === identifier ||
      !!this.aliases.find((a) => a === identifier)
      ? true
      : false;
  }

  /**
   * adds an help subcommand
   */
  private addHelpCommand() {
    this.commands.push(
      new Command({
        name: "help",
        description: `Help command for command "${this.namespace}"`,
        settings: { hidden: true },
        execution: async ({ actions }) => {
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
  public get parameters(): ICommandParameter[] {
    return this._parameters;
  }
  public set parameters(v: ICommandParameter[] | undefined) {
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
  public get settings(): ICommandSettings {
    return this._settings;
  }
  public set settings(v: ICommandSettings | undefined) {
    if (!v) return;
    this._settings = v;
  }

  // specific getters

  /**
   * returns the number of subcommands of the current command
   */
  public get commandCount(): number {
    return this.commands.filter((c) => !c.settings.hidden).length;
  }

  /**
   * returns a formatted syntax for current command
   */
  public get syntax(): string {
    return `${config.prefix}${this.namespace}${
      this.parameters.length !== 0 ? " " : ""
    }${this.parameters
      .map((p) => `[${p.required !== true ? "?" : ""}${p.name}]`)
      .join(" ")}`;
  }

  /**
   * returns an namespace in the form:
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
