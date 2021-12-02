import CCommandList from "../lib/commandManager/classes/commandList";
//import CommandList from "../bot/command.list";

// utility commands
import help from "./utility/help";
import time from "./utility/time";
import invite from "./utility/invite";
//import register from "./utility/register";
//import unregister from "./utility/unregister";

// fun commands
import hey from "./fun/hey";
import trueOrFalse from "./fun/trueorfalse";
import percentage from "./fun/percentage";
import morse from "./fun/morse";

// user commands
import profilePicture from "./userInformation/pp";
//import stats from "./userInformation/stats";

// entertainment commands
import music from "./special/music";

// exporting commands object

let commandList = new CCommandList();

commandList
	.addCommand(() => help, "Utility")
	.addCommand(() => time, "Utility")
	.addCommand(() => invite, "Utility")
	//.addCommand(() => register, "Utility")
	//.addCommand(() => unregister, "Utility")
	.addCommand(() => hey, "Fun")
	.addCommand(() => trueOrFalse, "Fun")
	.addCommand(() => percentage, "Fun")
	.addCommand(() => morse, "Fun")
	.addCommand(() => profilePicture, "User Information")
	//.addCommand(() => stats, "User Information")
	.addCommand(() => music, "Special");

export default commandList;
