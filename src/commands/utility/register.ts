import { MessageEmbed } from "discord.js";

import { Command } from "../../bot/command";
import { guildManager, userManager } from "../../bot/database";
import MessageInstance from "../../bot/message";

const register = new Command({
	name: "register",
	description: "Register a guild or an user",
	execution: (messageInstance: MessageInstance) => {
		let { methods } = messageInstance;

		let guildSubcommand = register.subcommands?.find(cmd => cmd.name === "guild");
		let userSubcommand = register.subcommands?.find(cmd => cmd.name === "user");

		methods.sendEmbed(`With this command, you can register guilds and users.
		By registering, the guild/user will be saved in my database so I will be able to provide more functions (collecting xp, shop, ...)\n
		\`${guildSubcommand?.syntax}\` ${guildSubcommand?.description}
		\`${userSubcommand?.syntax}\` ${userSubcommand?.description}`);
	},
	subcommands: [
		new Command({
			name: "guild",
			description: "Register current guild (you need to be the owner)",
			execution: async (messageInstance: MessageInstance) => {
				let { methods, message } = messageInstance;

				/*if (message.guild?.ownerId !== message.author.id)
					return methods.sendEmbed(`You are not the owner of this guild !`);*/

				if (await guildManager.exists(message.guild!.id) === true)
					return methods.sendEmbed(`Guild already registered`);

				guildManager.add(message.guild!)
					.then(() => methods.sendEmbed(`Guild registered successfully`))
					.catch(err => {
						console.log(err);
						methods.sendEmbed(`Failed to register guild`);
					});
			}
		}),
		new Command({
			name: "user",
			description: "Register yourself (current guild must be registered)",
			requiresDB: true,
			execution: async (messageInstance: MessageInstance) => {
				let { methods, message } = messageInstance;

				if (await userManager.exists(message.author!.id) === true)
					return methods.sendEmbed(`User already registered`);

				userManager.add(message.author!)
					.then(() => methods.sendEmbed(`User successfully registered`))
					.catch(err => {
						console.log(err);
						methods.sendEmbed(`Failed to register user`);
					});


			}
		})
	]
})

export default register;