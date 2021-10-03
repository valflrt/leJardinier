import { Command } from "../../bot/command";
import { guildManager, userManager } from "../../bot/database";
import MessageInstance from "../../bot/message";

const unregister = new Command({
	name: "unregister",
	description: "Unregister a guild or an user",
	execution: (messageInstance: MessageInstance) => {
		let { methods } = messageInstance;

		let guildCommand = unregister.commands?.find(
			(cmd) => cmd.name === "guild"
		);
		let userCommand = unregister.commands?.find(
			(cmd) => cmd.name === "user"
		);

		methods.sendEmbed(
			`With this command, you can unregister guilds and users.`
				.concat(
					`By unregistering, the guild/user will be removed from my database.\n\n`
				)
				.concat(
					`\`${guildCommand?.syntax}\` ${guildCommand?.description}`
				)
				.concat(
					`\`${userCommand?.syntax}\` ${userCommand?.description}`
				)
		);
	},
	commands: [
		new Command({
			name: "guild",
			description: "Unregister current guild (you need to be the owner)",
			execution: async (messageInstance: MessageInstance) => {
				let { methods, message } = messageInstance;

				/*if (message.guild?.ownerId !== message.author.id)
					return methods.sendEmbed(`You are not the owner of this guild !`);*/

				if ((await guildManager.exists(message.guild!.id)) === false)
					return methods.sendEmbed(`This guild is not registered`);

				guildManager
					.remove(message.guild!.id)
					.then(() =>
						methods.sendEmbed(`Guild unregistered successfully`)
					)
					.catch((err) => {
						console.log(err);
						methods.sendEmbed(`Failed to unregister guild`);
					});
			},
		}),
		new Command({
			name: "user",
			description: "Unregister yourself",
			requiresDB: true,
			execution: async (messageInstance: MessageInstance) => {
				let { methods, message } = messageInstance;

				if ((await userManager.exists(message.author!.id)) === false)
					return methods.sendEmbed(`This user is not registered`);

				userManager
					.remove(message.author!.id)
					.then(() =>
						methods.sendEmbed(`User unregistered successfully`)
					)
					.catch((err) => {
						console.log(err);
						methods.sendEmbed(`Failed to unregister user`);
					});
			},
		}),
	],
});

export default unregister;
