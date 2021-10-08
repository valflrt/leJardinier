import { MessageEmbed } from "discord.js";

import { Command } from "../../bot/command";

const pp = new Command({
	name: "pp",
	description: "Get profile picture",
	arguments: `[?mention]`,
	execution: async messageInstance => {
		let { methods, message } = messageInstance;

		let member = message.mentions.members?.first()?.user || message.author;
		if (!member) return methods.sendTextEmbed(`Unknown user`);

		methods.sendCustomEmbed((embed: MessageEmbed) =>
			embed
				.setDescription(`Here is ${member!.toString()} profile picture`)
				.setImage(member!.displayAvatarURL({ size: 300 }))
		);
	},
});

export default pp;
