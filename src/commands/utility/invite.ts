import { Command } from "../../bot/command";

import { linkButton } from "../../bot/interactions";

import reactions from "../../assets/reactions";

const invite = new Command({
	name: "invite",
	description: "Get bot invitation link",
	execution: async messageInstance => {
		let { methods, bot } = messageInstance;
		methods.reply({
			embeds: [
				methods.returnTextEmbed(
					`The button below allows you to add me in your server ${reactions.smile.random()}`
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
