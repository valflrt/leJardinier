import Command from "../classes/command";

import TExecutionFunction from "./executionFunction";
import ICommandParameter from "./commandParameter";
import ICommandSettings from "./commandSettings";

export default interface ICommandSetup {
  name: string;
  identifier?: string;
  description: string;

  execution: TExecutionFunction;

  commands?: Command[];
  parameters?: ICommandParameter[];
  aliases?: string[];

  settings?: ICommandSettings;
}