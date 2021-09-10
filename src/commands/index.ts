import CommandList from "../bot/command.list";

// utility commands
import help from "./utility/help";
import invite from "./utility/invite";

// fun commands
import hey from "./fun/hey";
import trueorfalse from "./fun/trueorfalse";
import percentage from "./fun/percentage";
import morse from "./fun/morse";
import { Command } from "../bot/command";
import database from "../bot/database";
import MessageInstance from "../bot/message";

// exporting commands object
let commandList = new CommandList(
	help,
	invite,
	hey,
	trueorfalse,
	percentage,
	morse,
	new Command({
		name: "registerguild",
		description: "register a guild",
		execution: (messageInstance: MessageInstance) => {
			let { message } = messageInstance;
			database.addGuild(message.guild!);
		}
	})
)

// sets categories (so commands are ordered and sorted here)
commandList
	.setCategory("Utility", [
		help,
		invite
	])
	.setCategory("Fun", [
		hey,
		trueorfalse,
		percentage,
		morse
	])

export default commandList;