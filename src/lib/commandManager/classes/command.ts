import CCommandParameter from "./commandParameter";
import TCommandParameterConfig from "../types/commandParameterConfig";
import TExecutionFunction from "../types/executionFunction";

export default class CCommand {
  private _name!: string;
  private _description!: string;
  private _parameters: CCommandParameter[] = [];
  private _parent: CCommand | null = null;

  private _execution!: TExecutionFunction;

  private _commands: CCommand[] = [];

  public setName(name: string) {
    this.name = name;
    return this;
  }
  public setDescription(description: string) {
    this.description = description;
    return this;
  }
  public addParameter(config: TCommandParameterConfig) {
    this.parameters.push(config(new CCommandParameter()));
    return this;
  }
  public setParent(parent: CCommand) {
    this.parent = parent;
  }
  public setExecution(execution: TExecutionFunction) {
    this.execution = execution;
    return this;
  }
  public addSubcommand(config: (command: CCommand) => CCommand) {
    let command = config(new CCommand());
    command.setParent(this);
    this.commands.push(command);
    return this;
  }

  public set name(v: string) {
    this._name = v.toLowerCase().trim();
  }
  public get name(): string {
    return this._name;
  }

  public get identifier(): string {
    return `${this._parent ? `${this._parent.identifier}.` : ""}${this.name}`;
  }

  public set description(v: string) {
    this._description = v.trim();
  }
  public get description(): string {
    return this._description;
  }

  public set parameters(v: CCommandParameter[]) {
    v.forEach((e) => e.name.toLowerCase().trim());
    this._parameters = v;
  }
  public get parameters(): CCommandParameter[] {
    return this._parameters;
  }

  public set parent(v: CCommand | null) {
    this._parent = v;
  }
  public get parent(): CCommand | null {
    return this._parent;
  }

  public set execution(v: TExecutionFunction) {
    this._execution = v;
  }
  public get execution(): TExecutionFunction {
    return this._execution;
  }

  public get commands(): CCommand[] {
    return this._commands;
  }

  public get syntax(): string {
    return `${"lj!" /*prefix*/}${this.parent ? this._parent!.name : ""}${
      this.identifier
    }`;
  }
}
