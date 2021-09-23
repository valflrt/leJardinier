import MessageInstance from "../../bot/message";
import { Command } from "../../bot/command";

import { linkButton } from "../../bot/interactions";

const invite = new Command({
	name: "invite",
	description: "Get bot invitation link",
	execution: (messageInstance: MessageInstance) => {
		let { methods, bot } = messageInstance;
		methods.send({
			embeds: [
				methods.returnEmbed(
					`The button below allow you to add me in your server`
				),
			],
			components: [
				linkButton(
					"Invite me !",
					bot.generateInvite({
						scopes: ["bot"],
						permissions: "ADMINISTRATOR",
					})
				),
			],
		});
	},
});

export default invite;
