import Commands from "../bot/commands";

// help command
import help from "./help";

// simple commands
import hey from "./hey";

export default new Commands(help, hey);