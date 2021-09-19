import MessageInstance from "../../bot/message";
import { Command } from "../../bot/command";
import { statManager } from "../../bot/database";

const stats = new Command({
	name: "stats",
	description: "Get stats",
	arguments: `[?mention]`,
	execution: async (messageInstance: MessageInstance) => {
		let { methods, message } = messageInstance;

		let stats = message.mentions.members?.size !== 0 ?
			await statManager.find(message.mentions.members!.first()!.id, message.guild!.id) :
			await statManager.find(message.author.id, message.guild!.id);

		if (!stats)
			return methods.sendEmbed(`Unknown user`);

		methods.sendEmbed(`${message.author.toString()}\n`
			.concat(`messages: ${stats!.messageCount}`)
		);

	}
})

export default stats;