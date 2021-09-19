import CommandList from "../bot/command.list";

// utility commands
import help from "./utility/help";
import invite from "./utility/invite";
import register from "./utility/register"
import unregister from "./utility/unregister";

// fun commands
import hey from "./fun/hey";
import trueOrFalse from "./fun/trueorfalse";
import percentage from "./fun/percentage";
import morse from "./fun/morse";

// user commands
import stats from "./user/stats";

// exporting commands object
let commandList = new CommandList(
	help,
	invite,
	register,
	unregister,
	hey,
	trueOrFalse,
	percentage,
	morse,
	stats
)

// sets categories (so commands are ordered and sorted here)
commandList
	.setCategory("Utility", [
		help,
		invite,
		register,
		unregister
	])
	.setCategory("Fun", [
		hey,
		trueOrFalse,
		percentage,
		morse
	])
	.setCategory("User", [
		stats
	])

export default commandList;