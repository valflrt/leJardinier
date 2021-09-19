import { MessageEmbed } from "discord.js";

import MessageInstance from "../../bot/message";
import { Command } from "../../bot/command";

const pp = new Command({
	name: "pp",
	description: "Get profile picture",
	arguments: `[?mention]`,
	execution: async (messageInstance: MessageInstance) => {
		let { methods, message } = messageInstance;

		let avatarURL = message.mentions.members?.size !== 0 ?
			message.mentions.members!.first()!.user.displayAvatarURL() :
			message.author.displayAvatarURL();

		if (!avatarURL)
			return methods.sendEmbed(`Unknown user`);

		methods.sendCustomEmbed((embed: MessageEmbed) =>
			embed.setDescription(`${message.author.toString()}`)
				.setImage(avatarURL)
		);

	}
})

export default pp;