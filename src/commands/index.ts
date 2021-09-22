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
import pp from "./user/pp";
import stats from "./user/stats";

// entertainment commands
import music from "./entertainment/music";

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
	pp,
	stats,
	music
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
		pp,
		stats
	])
	.setCategory("Entertainment", [
		music
	])

export default commandList;