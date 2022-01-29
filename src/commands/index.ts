import CommandList from "../features/commands/classes/commandList";

import help_cmd from "./commands/help";
import time_cmd from "./commands/time";
import invite_cmd from "./commands/invite";
import hey_cmd from "./commands/hey";
import boolean_cmd from "./commands/boolean";
import percentage_cmd from "./commands/percentage";
import choose_cmd from "./commands/choose";
import reverse_cmd from "./commands/reverse";
import morse_cmd from "./commands/morse";
import music_cmd from "./commands/music";
import weather_cmd from "./commands/weather";
import profilePicture_cmd from "./commands/pp";
import rank_cmd from "./commands/rank";
import autorole_cmd from "./commands/autorole";
// import kick_cmd from "./commands/kick";
// import ban_cmd from "./commands/ban";

let commandList = new CommandList()
  .addCommand(help_cmd, "Utility")
  .addCommand(time_cmd, "Utility")
  .addCommand(invite_cmd, "Utility")
  .addCommand(hey_cmd, "Fun")
  .addCommand(boolean_cmd, "Fun")
  .addCommand(percentage_cmd, "Fun")
  .addCommand(choose_cmd, "Fun")
  .addCommand(reverse_cmd, "Fun")
  .addCommand(morse_cmd, "Fun")
  .addCommand(music_cmd, "Special")
  .addCommand(weather_cmd, "Special")
  .addCommand(profilePicture_cmd, "User Information")
  .addCommand(rank_cmd, "User Information")
  .addCommand(autorole_cmd, "Moderation");
//.addCommand(kick_cmd, "Moderation")
//.addCommand(ban_cmd, "Moderation")

export default commandList;
