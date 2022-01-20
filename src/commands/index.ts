import CCommandList from "../features/commands/classes/commandList";

import help from "./commands/help";
import time from "./commands/time";
import invite from "./commands/invite";

import autorole from "./commands/autorole";
import kick from "./commands/kick";
import ban from "./commands/ban";

import hey from "./commands/hey";
import boolean from "./commands/boolean";
import percentage from "./commands/percentage";
import choose from "./commands/choose";
import reverse from "./commands/reverse";
import morse from "./commands/morse";

import profilePicture from "./commands/pp";
import stats from "./commands/stats";

import music from "./commands/music";

let commandList = new CCommandList()
  .addCommand(() => help, "Utility")
  .addCommand(() => time, "Utility")
  .addCommand(() => invite, "Utility")
  .addCommand(() => hey, "Fun")
  .addCommand(() => boolean, "Fun")
  .addCommand(() => percentage, "Fun")
  .addCommand(() => choose, "Fun")
  .addCommand(() => reverse, "Fun")
  .addCommand(() => morse, "Fun")
  .addCommand(() => music, "Music")
  .addCommand(() => profilePicture, "User Information")
  .addCommand(() => stats, "User Information")
  .addCommand(() => autorole, "Moderation")
  .addCommand(() => kick, "Moderation")
  .addCommand(() => ban, "Moderation");

export default commandList;
