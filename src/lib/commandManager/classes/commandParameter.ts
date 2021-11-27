export default class CCommandParameter {
  private _name!: string;
  private _type!: StringConstructor | NumberConstructor;

  public setName(name: string) {
    this.name = name;
    return this;
  }
  public setType(type: StringConstructor | NumberConstructor) {
    this.type = type;
    return this;
  }

  public set name(v: string) {
    this._name = v.toLowerCase().trim();
  }
  public get name(): string {
    return this._name;
  }

  public set type(v: StringConstructor | NumberConstructor) {
    this._type = v;
  }
  public get type(): StringConstructor | NumberConstructor {
    return this._type;
  }
}
