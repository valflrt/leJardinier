import { Permissions } from "discord.js";
import { italic } from "@discordjs/builders";

import CCommand from "../../lib/command/classes/command";

const autorole = new CCommand()
	.setName("autorole")
	.setDescription(
		"Adds a watcher on a message".concat(
			"When a specific mention is added by a member, they get a specific role"
		)
	)
	.addParameter((p) => p.setName("role mention").setRequired(true))
	.addParameter((p) => p.setName("emoji").setRequired(true))
	.setExecution(async (messageInstance) => {
		let { methods, message, commandParameters } = messageInstance;

		let caller = await message.guild?.members.fetch(message.author.id);
		if (!caller?.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
			return methods.sendTextEmbed(
				"You do not have the permission to add the autorole !\n".concat(
					italic("You must be administrator")
				)
			);

		let reference = await message.fetchReference();
		if (!reference)
			return methods.sendTextEmbed(
				`You need to reply to the message to watch !`
			);

		let roleMention = message.mentions.roles.first();
		if (!roleMention)
			return methods.sendTextEmbed(
				"You need to specify the role to add automatically !"
			);

		let emoji = commandParameters.split(/\s+/g)[1];
		reference.react(emoji);

		/**
		 * TODO: When database remastered:
		 * save "reference.id" to database so on restart,
		 * the collector is auto re-added
		 */

		let collector = reference.createReactionCollector({
			filter: (r) => {
				console.log(r.me);
				return emoji === r.emoji.toString() && r.me;
			},
		});

		collector.on("collect", async (r, user) => {
			if (user.bot) return;
			console.log(r);
			(await message.guild!.members.fetch(user.id)).roles.add(
				roleMention!.id
			);
			r.users.remove(user);
		});

		methods
			.sendTextEmbed(
				"Watcher added successfully, deleting this message and yours in 10 seconds..."
			)
			.then((sent) =>
				setTimeout(async () => {
					try {
						await message.delete();
						await sent.delete();
					} catch (e) {
						console.log(e);
					}
				}, 10e3)
			);
	})
	.addHelpCommand();

export default autorole;
