export default class CCommandParameter {
	private _name!: string;
	private _required: boolean = false;

	/**
	 * sets parameter name
	 * @param name parameter name
	 */
	public setName(name: string): this {
		this.name = name;
		return this;
	}
	public setRequired(required: boolean): this {
		this.required = required;
		return this;
	}

	// setters and getters

	public set name(v: string) {
		this._name = v.toLowerCase().trim();
	}
	public get name(): string {
		return this._name;
	}

	public set required(v: boolean) {
		this._required = v;
	}
	public get required(): boolean {
		return this._required;
	}
}
