import CCommandList from "../managers/commands/classes/commandList";

// utility commands
import help from "./commands/help";
import time from "./commands/time";
import invite from "./commands/invite";

// moderation commands
import autorole from "./commands/autorole";
import kick from "./commands/kick";
import ban from "./commands/ban";

// fun commands
import hey from "./commands/hey";
import trueOrFalse from "./commands/trueOrFalse";
import percentage from "./commands/percentage";
import choose from "./commands/choose";
import reverse from "./commands/reverse";
import morse from "./commands/morse";

// user commands
import profilePicture from "./commands/pp";
import stats from "./commands/stats";

// music command
import music from "./commands/music";

// exporting commands object

let commandList = new CCommandList();

commandList
  .addCommand(() => help, "Utility")
  .addCommand(() => time, "Utility")
  .addCommand(() => invite, "Utility")
  .addCommand(() => autorole, "Moderation")
  .addCommand(() => kick, "Moderation")
  .addCommand(() => ban, "Moderation")
  .addCommand(() => hey, "Fun")
  .addCommand(() => trueOrFalse, "Fun")
  .addCommand(() => percentage, "Fun")
  .addCommand(() => choose, "Fun")
  .addCommand(() => reverse, "Fun")
  .addCommand(() => morse, "Fun")
  .addCommand(() => profilePicture, "User Information")
  .addCommand(() => stats, "User Information")
  .addCommand(() => music, "Music");

export default commandList;
