import { MessageEmbed } from "discord.js";

import MessageInstance from "../../bot/message";
import { Command } from "../../bot/command";

const invite = new Command({
	name: "invite",
	description: "Get bot invitation link",
	execution: (messageInstance: MessageInstance) => {
		let { methods, bot } = messageInstance;
		methods.sendCustomEmbed((embed: MessageEmbed) =>
			embed
				.setTitle("Invitation link")
				.setURL(
					bot.generateInvite({
						scopes: ["bot"],
						permissions: "ADMINISTRATOR",
					})
				)
				.setDescription(
					`The link above allow you to add me in your server`
				)
		);
	},
});

export default invite;
