import CCommandParameter from "./commandParameter";
import TCommandParameterConfig from "../types/commandParameterConfig";
import TExecutionFunction from "../types/executionFunction";

import config from "../../../config";
import CSubcommandPreview from "../../formatting/subcommand";
import { bold, underscore } from "@discordjs/builders";

export default class CCommand {
	private _name!: string;
	private _identifier!: string;
	private _aliases: string[] = [];
	private _description!: string;
	private _parameters: CCommandParameter[] = [];
	private _parent: CCommand | null = null;

	private _execution!: TExecutionFunction;

	private _commands: CCommand[] = [];

	/**
	 * sets command name
	 * @param name command name
	 */
	public setName(name: string): CCommand {
		this.name = name;
		this.identifier = name;
		return this;
	}
	/**
	 * sets command identifier
	 * note: If not specified identifier set to command name
	 * @param identifier command identifier: what is used to call the command in discord.
	 */
	public setIdentifier(identifier: string): CCommand {
		this._identifier = identifier;
		return this;
	}
	/**
	 * adds a command alias
	 * @param alias command alias
	 */
	public addAlias(alias: string): CCommand {
		this.aliases.push(alias.toLowerCase().trim());
		return this;
	}
	/**
	 * sets command description
	 * @param description command description
	 */
	public setDescription(description: string): CCommand {
		this.description = description;
		return this;
	}
	/**
	 * adds a command parameter
	 * @param config function taking a new CCommandParameter as only argument, used to
	 * configure a CCommandParameter
	 * note: you can't only use the function to configure the parameter, you can also
	 * make it return one you created outside the function:
	 * @example command.addParameter(() => new CCommandParameter)
	 */
	public addParameter(config: TCommandParameterConfig): CCommand {
		this.parameters.push(config(new CCommandParameter()));
		return this;
	}
	/**
	 * sets the command parent
	 * @param parent command parent
	 */
	public setParent(parent: CCommand): this {
		this.parent = parent;
		return this;
	}
	public setExecution(execution: TExecutionFunction): CCommand {
		this.execution = execution;
		return this;
	}
	/**
	 * adds a subcommand
	 * @param config function taking a new CCommand as only argument, used to configure
	 * a CCommand
	 * note: you can do the same as explained in CCommand#addParameter
	 */
	public addSubcommand(config: (command: CCommand) => CCommand): CCommand {
		let command = config(new CCommand());
		command.setParent(this).export();
		this.commands.push(command);
		return this;
	}

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
	 * finalizes the command creation
	 */
	public export() {
		this.addSubcommand((c) =>
			c
				.setName("help")
				.setDescription(
					`Get help about command ${this.wholeIdentifier}`
				)
				.setExecution(async (messageInstance) => {
					let { methods } = messageInstance;

					let preview = new CSubcommandPreview(this);
					methods.sendCustomEmbed((embed) =>
						embed
							.setDescription(
								`${bold(preview.title)}\n`
									.concat(preview.description)
									.concat(
										this.commands
											? `\n\n${bold(
													underscore(`Subcommands:`)
											  )}\n`
											: ""
									)
							)
							.addFields(
								CSubcommandPreview.createFields(this.commands)
							)
					);
				})
		);
		return this;
	}

	// setters and getters

	public set name(v: string) {
		this._name = v.toLowerCase().trim();
	}
	public get name(): string {
		return this._name;
	}

	public get aliases(): string[] {
		return this._aliases;
	}

	public set identifier(v: string) {
		this._identifier = v;
	}
	public get identifier(): string {
		return this._identifier;
	}
	/**
	 * returns an identifier in the form:
	 * [command prefix][parent commands identifiers separated by dots][current command identifier]
	 * @example lj!help.command.name
	 */
	public get wholeIdentifier(): string {
		return `${this.parent ? `${this.parent.wholeIdentifier}.` : ""}${
			this._identifier
		}`;
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
		return `${config.prefix}${this.wholeIdentifier}${
			this.parameters.length !== 0 ? " " : ""
		}${this.parameters
			.map((p) => `[${p.required !== true ? "?" : ""}${p.name}]`)
			.join(" ")}`;
	}
}
