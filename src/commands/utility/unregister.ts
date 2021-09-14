import { MessageEmbed } from "discord.js";

import { Command } from "../../bot/command";
import { guildManager } from "../../bot/database";
import MessageInstance from "../../bot/message";

const unregister = new Command({
	name: "unregister",
	description: "Unregister a guild or an user",
	execution: (messageInstance: MessageInstance) => {
		let { methods } = messageInstance;

		let guildSubcommand = unregister.subcommands?.find(cmd => cmd.name === "guild");
		let userSubcommand = unregister.subcommands?.find(cmd => cmd.name === "user");

		methods.sendEmbed(`With this command, you can unregister guilds and users.
		By unregistering, the guild/user will be removed from my database.\n
		\`${guildSubcommand?.syntax}\` ${guildSubcommand?.description}
		\`${userSubcommand?.syntax}\` ${userSubcommand?.description}`);
	},
	subcommands: [
		new Command({
			name: "guild",
			description: "Unregister current guild (you need to be the owner)",
			execution: (messageInstance: MessageInstance) => {
				let { methods, message } = messageInstance;

				/*if (message.guild?.ownerId !== message.author.id)
					return methods.sendEmbed(`You are not the owner of this guild !`);*/

				guildManager.remove(message.guild!.id)
					.then(() => methods.sendEmbed(`Guild unregistered successfully`))
					.catch(err => {
						console.log(err);
						methods.sendEmbed(`Failed to unregister guild`);
					});
			}
		}),
		new Command({
			name: "user",
			description: "Unregister yourself",
			requiresDB: true,
			execution: (messageInstance: MessageInstance) => {
				let { methods } = messageInstance;


			}
		})
	]
})

export default unregister;