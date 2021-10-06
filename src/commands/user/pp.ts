import { MessageEmbed } from "discord.js";

import MessageInstance from "../../bot/message";
import { Command } from "../../bot/command";

const pp = new Command({
	name: "pp",
	description: "Get profile picture",
	arguments: `[?mention]`,
	execution: async (messageInstance: MessageInstance) => {
		let { methods, message } = messageInstance;

		let user =
			message.mentions.members?.size !== 0
				? message.mentions.members?.first()?.user
				: message.author;

		if (!user) return methods.sendTextEmbed(`Unknown user`);

		methods.sendCustomEmbed((embed: MessageEmbed) =>
			embed
				.setDescription(`Here is ${user!.toString()} profile picture`)
				.setImage(user!.displayAvatarURL())
		);
	},
});

export default pp;
