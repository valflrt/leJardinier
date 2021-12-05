import CCommand from "../../lib/commandManager/classes/command";
import { time } from "@discordjs/builders";

import reactions from "../../assets/reactions";

const Ctime = new CCommand()
	.setName("time")
	.setDescription("Get the time")
	.setExecution(async (messageInstance) => {
		let { methods } = messageInstance;
		methods.sendTextEmbed(
			`It is ${time(new Date(), "t")} ${reactions.smile.random()}`
		);
	})
	.export();

export default Ctime;
