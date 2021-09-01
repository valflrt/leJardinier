import Commands from "../bot/commands";

// utility commands
import help from "./utility/help";

// fun commands
import hey from "./fun/hey";
import trueorfalse from "./fun/trueorfalse";
import percentage from "./fun/percentage";
import morseEncode from "./fun/morse.encode";

// exporting commands object (commands are ordered here)
export default new Commands(
	help,
	hey,
	trueorfalse,
	percentage,
	morseEncode
)