import { inlineCode } from "@discordjs/builders";

import CCommand from "../../lib/commandManager/classes/command";

import { randomItem } from "../../utils";

const choose = new CCommand()
	.setName("choose")
	.setDescription("Chooses one of the items specified")
	.setExecution(async (messageInstance) => {
		let { methods, commandParameters } = messageInstance;
		let items = commandParameters.split(/\s{0,}\|\s{0,}/g);
		methods.sendTextEmbed(`I choose: ${inlineCode(randomItem(...items))}`);
	});

export default choose;
