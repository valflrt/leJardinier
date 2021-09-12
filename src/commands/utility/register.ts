import { MessageEmbed } from "discord.js";

import { Command } from "../../bot/command";
import { guildManager } from "../../bot/database";
import MessageInstance from "../../bot/message";

const register = new Command({
	name: "register",
	description: "Register a guild or an user",
	execution: (messageInstance: MessageInstance) => {
		let { methods } = messageInstance;

		let guildSubcommand = register.subcommands?.find(cmd => cmd.name === "guild");
		let userSubcommand = register.subcommands?.find(cmd => cmd.name === "user");

		methods.sendEmbed(`With this command, you can register guilds and users.
		By registering, the guild/user will be saved in my database so I will be able to provide more functions (collecting xp, shop, ...)
		\`${guildSubcommand?.syntax}\` ${guildSubcommand?.description}
		\`${userSubcommand?.syntax}\` ${userSubcommand?.description}`);
	},
	subcommands: [
		new Command({
			name: "guild",
			description: "Registers current guild (you need to be the owner)",
			execution: (messageInstance: MessageInstance) => {
				let { methods, message } = messageInstance;

				if (message.guild?.ownerId !== message.author.id || message.author.id === "564012236851511298")
					return methods.sendEmbed(`You are not the owner of this guild !`);

				guildManager.add(message.guild)
					.then(() => methods.sendEmbed(`Guild registered successfully`))
					.catch(err => {
						console.log(err);
						methods.sendEmbed(`Failed to register guild`);
					});
			}
		}),
		new Command({
			name: "user",
			description: "Register yourself",
			execution: (messageInstance: MessageInstance) => {
				let { methods } = messageInstance;

			}
		})
	]
})

export default register;