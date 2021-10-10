import { inlineCode } from "@discordjs/builders";

import { Command } from "../../bot/command";
import { guildManager, userManager } from "../../bot/database";

const register = new Command({
	name: "register",
	description: "Register a guild or an user",
	execution: async messageInstance => {
		let { methods } = messageInstance;

		methods.sendTextEmbed(
			`With this command, you can register guilds and users.\n`
				.concat(
					`By registering, the guild/user will be saved in my database so I will be able to provide more functions (collecting xp, shop, ...)\n`
				)
				.concat(
					`- ${inlineCode(`lj!register guild`)}: register the current guild\n`
				)
				.concat(
					`- ${inlineCode(`lj!register user`)}: register yourself`
				)
		);
	},
	commands: [
		new Command({
			name: "guild",
			description: "Register current guild (you need to be the owner)",
			execution: async messageInstance => {
				let { methods, message } = messageInstance;

				/*if (message.guild?.ownerId !== message.author.id)
					return methods.sendTextEmbed(`You are not the owner of this guild !`);*/

				if ((await guildManager.exists(message.guild!.id)) === true)
					return methods.sendTextEmbed(`Guild already registered`);

				guildManager
					.add(message.guild!)
					.then(() =>
						methods.sendTextEmbed(`Guild registered successfully`)
					)
					.catch((err) => {
						console.log(err);
						methods.sendTextEmbed(`Failed to register guild`);
					});
			},
		}),
		new Command({
			name: "user",
			description: "Register yourself (current guild must be registered)",
			requiresDB: true,
			execution: async messageInstance => {
				let { methods, message } = messageInstance;

				if ((await userManager.exists(message.author!.id)) === true)
					return methods.sendTextEmbed(`User already registered`);

				userManager
					.add(message.author!)
					.then(() =>
						methods.sendTextEmbed(`User successfully registered`)
					)
					.catch((err) => {
						console.log(err);
						methods.sendTextEmbed(`Failed to register user`);
					});
			},
		}),
	],
});

export default register;
