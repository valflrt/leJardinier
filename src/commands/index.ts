import CommandList from "../bot/command.list";

// utility commands
import help from "./utility/help";

// fun commands
import hey from "./fun/hey";
import trueorfalse from "./fun/trueorfalse";
import percentage from "./fun/percentage";
import morse from "./fun/morse";

// exporting commands object
let commandList = new CommandList(
	help,
	hey,
	trueorfalse,
	percentage,
	morse
)

// sets categories (so commands are ordered and sorted here)
commandList
	.setCategory("Utility", [help])
	.setCategory("Fun", [
		hey,
		trueorfalse,
		percentage,
		morse
	])

export default commandList;